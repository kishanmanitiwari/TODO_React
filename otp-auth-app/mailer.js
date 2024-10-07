import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(config);

async function sendMail(to, subject, text) {
  const mailOption = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  return transporter.sendMail(mailOption);
}

export default sendMail;
