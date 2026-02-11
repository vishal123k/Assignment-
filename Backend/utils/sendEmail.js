const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("Server is ready to send mail");
  }
});


const sendEmail = async (to, subject, text) => {
  try {

    await transporter.sendMail({
      from: `"PawMatch" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent");

  } catch (err) {

    console.log("EMAIL ERROR", err.message);
  }
};

module.exports = sendEmail;
