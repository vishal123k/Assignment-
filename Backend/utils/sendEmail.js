const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // ⭐ VERY IMPORTANT (IPv6 error fix)
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"PawMatch" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    throw err;
  }
};

module.exports = sendEmail;
