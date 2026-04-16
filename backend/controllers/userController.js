const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const verifyEmail = require("../emailVerify/verifyEmail");
const sessionModel = require("../models/sessionModel");
const sendOtpEmail = require("../emailVerify/sendOTPMail");
const cloudinary = require("../utils/cloudinary");

// register user
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    // ✅ check SECRET_KEY
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY missing");
    }

    const token = jwt.sign(
      { id: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );

    // ✅ safe email sending
    try {
      await verifyEmail(token, email);
    } catch (err) {
      console.error("Email error:", err.message);
    }

    return res.status(201).json({
      success: true,
      message: "User registration successful",
      user: newUser,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error); // 🔥 IMPORTANT

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User Verification
const verifyUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(400).json({
        success: false,
        message: "Authorization token is missing",
      
      })
    }
    const token = authHeader.split(" ")[1]; // ["Bearer", "tokenValue"] => tokenValue
    let decoded 
      try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
      } catch (error) {
        if(error.name==="TokenExpiredError"){
          return res.status(400).json({
            success: false,
            message: "Token has expired",
          })
        }
        return res.status(400).json({
          success: false,
          message: " Token verification failed",
        })
      }
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      user.token = null; // Clear the token after successful verification
      user.isVerified = true; // Mark the user as verified
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Re-verify user
const reVerifyUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "10m" });
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Verification email again sent successfully",
      token: user.token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Login user

const login = async (req, res) => {
  
  try {
    console.log("LOGIN BODY:", req.body);

    const{ email,password} = req.body;
    if (!email || !password){
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
      
    }
    
    const existingUser = await userModel.findOne({email});
    if(!existingUser){
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    const isPasswordValid = await bcrypt.compare(password,existingUser.password);
    if(!isPasswordValid){
      return res.status(400).json({
        success: false,
        message: "Wrong password",
      })
    }
    if(existingUser.isVerified === false){
      return res.status(400).json({
        success: false,
        message: "Email not verified. Please verify your email before logging in.",
      })
    }

    // genrate token
    const accessToken = jwt.sign({ id: existingUser._id},process.env.SECRET_KEY,{expiresIn:'10d'});
    const refreshToken = jwt.sign({ id: existingUser._id},process.env.SECRET_KEY,{expiresIn:'30d'});

    existingUser.isLoggedIn = true;
    await existingUser.save();

    // check the esisting session for the user and delete it
    const existingSession = await sessionModel.findOne({userId: existingUser._id});
    if(existingSession){
      await sessionModel.deleteOne({userId: existingUser._id});
    }

    // Creating Session 
    await sessionModel.create({ userId: existingUser._id });
    return res.status(200).json({
      success:true,
      message:`Welcome back ${existingUser.firstName}`,
      user: existingUser,
      accessToken,
      refreshToken
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Logout user
const logout = async(req,res)=>{
  try {
    const userId = req.user._id;
    await sessionModel.deleteMany({userId : userId});
    await userModel.findByIdAndUpdate(userId,{isLoggedIn:false});
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Forget Password
const forgetPassword = async(req,res)=>{
  try {
    const { email} = req.body;
    const user = await userModel.findOne({ email });
    if(!user){
      return res.status(400).json({
        success: false,
        message: "user not found"
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // Set OTP expiration time (10 minutes)
    user.otp = otp;
    user.otpExpire = otpExpire;

    await user.save();
    await sendOtpEmail(otp, email);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Verify OTP and reset password

const verifyOTP = async(req,res)=>{
  try {
    const {otp} = req.body;
    const email = req.params.email
    if(!otp){
      return res.status(400).json({
        success:false,
        message:"OTP required"
      })
    }

    const user = await userModel.findOne({email})
    if(!user){
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }
    if(!user.otp || !user.otpExpire){
      return res.status(400).json({
        success : false,
        message : "OTP is not genrated or Already Verified"
      })
    }
    if(user.otpExpire < Date.now()){
      return res.status(400).json({
        success: false,
        message: "OTP has expired"
      })
    }
    user.otp = null
    user.otpExpire = null

    await user.save()
    return res.status(200).json({
      success : true,
      message: "OTP verified successfully, you can reset your password now"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Change Password after OTP verification

const changePassword = async(req,res)=>{
  try {
    const {newPassword ,confirmPassword} = req.body;
    const {email} = req.params;
    const user = await userModel.findOne({email});

    if(!user){
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }
    if(newPassword !== confirmPassword){
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match"
      })
    }

    const hashPassword = await bcrypt.hash(newPassword,10);
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// All User related controllers will be here like register, login, logout, forget password, change password, verify user etc.

const allUsers = async(req,res)=>{
  try {
    const users = await userModel.find();
    return res.status(200).json({
      success:true,
      users
    })
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

// Get User By ID

const getUserById = async(req,res)=>{
  try {
    const {userId} = req.params;
    const user = await userModel.findById(userId).select("-password -oyp -otpExpire -token")
    if(!user){
      return res.status(400).json({
        success : false,
        message : "User Not Found"
      })
    }
    res.status(200).json({
      success: true,
      user
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}
const updateUser = async (req, res) => {
  try {
    let user;

    // ✅ CASE 1: Admin updating any user
    if (req.params.userId) {
      user = await userModel.findById(req.params.userId);
    } 
    // ✅ CASE 2: Logged-in user updating own profile
    else {
      user = await userModel.findById(req.user._id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      firstName,
      lastName,
      phoneNo,
      address,
      city,
      zipCode,
    } = req.body;

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    // ✅ IMAGE UPLOAD
    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    // ✅ UPDATE FIELDS
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNo = phoneNo || user.phoneNo;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      firstName,
      lastName,
      phoneNo,
      address,
      city,
      zipCode,
    } = req.body;

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    // ✅ IMAGE UPLOAD
    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    // ✅ UPDATE
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNo = phoneNo || user.phoneNo;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
const updateUser = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const {
      firstName,
      lastName,
      phoneNo,
      address,
      city,
      zipCode,
    } = req.body;

    let user = await userModel.findById(loggedInUser._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    // ✅ IMAGE UPLOAD
    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    // ✅ UPDATE FIELDS
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNo = phoneNo || user.phoneNo;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};*/
module.exports = { register, verifyUser, reVerifyUser, login ,logout, forgetPassword ,verifyOTP ,changePassword ,allUsers ,getUserById, updateUser};
