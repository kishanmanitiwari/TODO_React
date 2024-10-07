// routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import sendMail from "../mailer.js";

const prisma = new PrismaClient();
const router = express.Router();

// Generate OTP function
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP(); //6 digit otp

  // Save the user with OTP
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
    },
  });

  // Send OTP via email
  await sendMail(
    email,
    "Verify your email",
    `Your OTP code is ${otp}, Please enter this otp to verify your email`
  );

  res.status(201).json({ message: "User registered, OTP sent to email" });
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ message: "User not found" });

    // Verify OTP
    if (user.otp === otp) {
      await prisma.user.update({
        where: { email },
        data: { isVerified: true, otp: null }, // Clear OTP and mark as verified
      });

      res.status(200).json({ message: "Email verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "User not found" });

  // Check if email is verified
  if (!user.isVerified)
    return res.status(400).json({ message: "Email not verified" });

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid password" });

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email }, //Payload
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ message: "Login successful", token });
});

router.post("/forget-password", async (req, res) => {
  const { email, newPassword } = req.body;

  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "User not found" });

  // Check if email is verified
  if (!user.isVerified)
    return res.status(400).json({ message: "Email not verified" });

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password in the database
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  res.status(200).json({ message: "Password updated successfully" });
});

export default router;
