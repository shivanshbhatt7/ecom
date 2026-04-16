const mongoose =  require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    password:{type:String, required:true},
    profilePic: {type:String ,default:""},  // cloudanary image url,
    profilePicPublicId: {type:String,default:""}, //cloudanary public id for deletion
    email:{type:String,required:true},
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    token:{type:String,default:null},
    isVerified:{type:Boolean,default:false},
    isLoggedIn:{type:Boolean,default:false},
    otp:{type:String,default:null},
    otpExpire:{type:Date,default:null},
    address:{type:String},
    city:{type:String},
    zipCode:{type:String},
    phoneNo:{type:String}
},{timestamps:true})


module.exports = mongoose.model("User",userSchema)