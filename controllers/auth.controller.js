import bcrypt from "bcryptjs";
import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";
import { generateTokens } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import crypto from "crypto";

export const register = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ status: 400, message: "User already exists" });
  }

  const user = await UserModel.create({
    name,
    slug: slugify(name),
    email,
    password,
  });

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    status: 201,
    message: "User created successfully",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      slug: user.slug,
    },
  });
});

export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: "Email and password are required",
    });
  }

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      status: 401,
      message: "Invalid email or password",
    });
  }

  console.log("User found:", user);

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isPasswordMatch);
  if (!isPasswordMatch) {
    return res.status(401).json({
      status: 401,
      message: "Invalid email or password",
    });
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({
    status: 200,
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      slug: user.slug,
    },
  });
});

export const refreshToken = expressAsyncHandler(async (req, res) => {
  const { refreshToken: userRefreshToken } = req.body;

  if (!userRefreshToken) {
    return res.status(401).json({
      status: 401,
      message: "Refresh token is required",
    });
  }

  try {
    const decoded = jwt.verify(userRefreshToken, config.jwt.refreshSecret);
    const user = await UserModel.findById(decoded.id);

    console.log("Decoded user:", decoded);
    console.log("refreshToken User found:", user);

    if (!user || user.refreshToken !== userRefreshToken) {
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
      return res.status(401).json({
        status: 401,
        message: "Invalid refresh token - possible token theft detected",
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Tokens refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Invalid refresh token",
    });
  }
});

export const logout = expressAsyncHandler(async (req, res) => {
  const userId = req.user.id;

  await UserModel.findByIdAndUpdate(userId, { refreshToken: null });

  res.status(200).json({
    status: 200,
    message: "Logout successful",
  });
});

export const forgetPassword = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: 400,
      message: "Email is required",
    });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({
      status: 401,
      message: "Invalid email",
    });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.passwordResetCode = hashedOTP;
  user.passwordResetExpires = otpExpiry;
  await user.save();

  console.log(`Password reset OTP for ${email}: ${otp}`);

  res.status(200).json({
    status: 200,
    message: "Password reset OTP sent successfully",
    otp,
  });
});

export const verifyOTP = expressAsyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      status: 400,
      message: "Email and OTP are required",
    });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({
      status: 401,
      message: "Invalid email",
    });
  }

  console.log(`verifyOTP OTP for ${email}: ${otp}`);
  console.log("User in OTP IS : ", user);

  if (!user.passwordResetCode || !user.passwordResetExpires) {
    return res.status(400).json({
      status: 400,
      message: "No password reset request found",
    });
  }

  // Check if OTP has expired
  if (new Date() > user.passwordResetExpires) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(400).json({
      status: 400,
      message: "OTP has expired. Please request a new one",
    });
  }

  // Hash the provided OTP to compare with stored hash
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  console.log("hashedOTP : ", hashedOTP);
  console.log("user.passwordResetCode : ", user.passwordResetCode);

  if (hashedOTP !== user.passwordResetCode) {
    return res.status(400).json({
      status: 400,
      message: "Invalid OTP",
    });
  }

  res.status(200).json({
    status: 200,
    message: "OTP verified successfully",
  });
});

export const resetPassword = expressAsyncHandler(async (req, res) => {
  const { email, otp, password, confirmPassword } = req.body;

  if (!email || !otp || !password || !confirmPassword) {
    return res.status(400).json({
      status: 400,
      message: "Email, OTP, password, and confirm password are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 400,
      message: "Password and confirm password do not match",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      status: 400,
      message: "Password must be at least 6 characters long",
    });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({
      status: 401,
      message: "Invalid email",
    });
  }

  if (!user.passwordResetCode || !user.passwordResetExpires) {
    return res.status(400).json({
      status: 400,
      message: "No password reset request found",
    });
  }

  // Check if OTP has expired
  if (new Date() > user.passwordResetExpires) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(400).json({
      status: 400,
      message: "OTP has expired. Please request a new one",
    });
  }

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  if (hashedOTP !== user.passwordResetCode) {
    return res.status(400).json({
      status: 400,
      message: "Invalid OTP",
    });
  }

  // Update password and clear reset fields
  user.password = password;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = new Date();

  await user.save();

  res.status(200).json({
    status: 200,
    message: "Password reset successfully",
  });
});
