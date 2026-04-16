const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOtpEmail = async (otp, email) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",

      html :`<p>Your OTP For Password reset is: <b>${otp}</b></p>`
    };

    transporter.sendMail(mailConfigurations,function(error,info){
        if(error){
            console.log("❌ Email Error:", error);
        } else {
            console.log("✅ Email Sent Successfully");
            console.log(info.response);
        }
    });

  } catch (error) {
    console.log("❌ Email Error:", error);
  }
};

module.exports = sendOtpEmail;