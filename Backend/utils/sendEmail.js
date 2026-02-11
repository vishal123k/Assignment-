const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,          // ⭐ CHANGE THIS
  secure: false,      // ⭐ MUST be false with 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {

    await transporter.sendMail({
      from: `"PawMatch" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent");

  } catch (err) {

    console.log("❌ EMAIL ERROR 👉", err.message);
  }
};

module.exports = sendEmail;
