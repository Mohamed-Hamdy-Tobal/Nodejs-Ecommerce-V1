import bcrypt from "bcryptjs";
import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";
import { generateTokens } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

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
