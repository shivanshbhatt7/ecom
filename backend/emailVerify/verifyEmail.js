const nodemailer = require("nodemailer");
require("dotenv").config();

const verifyEmail = async (token, email) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // ✅ HARDCODE YOUR DOMAIN HERE
    const link = `http://localhost:5173/verify/${token}`;

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",

      // ✅ Use HTML for clickable link
      html: `
        <h2>Email Verification</h2>
        <p>Hi there,</p>
        <p>You recently registered on our website.</p>
        <p>Click below to verify your email:</p>

        <a href="${link}" target="_blank" style="
          display:inline-block;
          padding:10px 20px;
          background-color:#4CAF50;
          color:white;
          text-decoration:none;
          border-radius:5px;
        ">
          Verify Email
        </a>

        <p>If button doesn't work, use this link:</p>
        <p>${link}</p>

        <br/>
        <p>Thanks,<br/>E-Kart Team</p>
      `,
    };

    const info = await transporter.sendMail(mailConfigurations);

    console.log("✅ Email Sent Successfully");
    console.log(info.response);

  } catch (error) {
    console.log("❌ Email Error:", error);
  }
};

module.exports = verifyEmail;