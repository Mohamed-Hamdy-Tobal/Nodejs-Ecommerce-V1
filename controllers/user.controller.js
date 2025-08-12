import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import paginateResults from "../utils/pagination.js";
import { AppError } from "../utils/errorHandlers.js";
import UserModel from "../models/user.model.js";
import { FilterFactory } from "../utils/filters/filterFactory.js";
import bcrypt from "bcryptjs";

export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const userFilter = FilterFactory.getFilter("users");
  const { filter, sort, select } = userFilter(req.query);

  const { results, pagination } = await paginateResults(UserModel, req, { filter, sort, select });

  res.status(200).json({
    success: true,
    pagination,
    results,
  });
});

export const getSingleUser = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await UserModel.findById(id, {
    password: 0,
    refreshToken: 0,
    tokenVersion: 0,
    passwordChangedAt: 0,
  });

  if (!user) {
    return next(new AppError(`User not found for this id ${id}`, 404));
  }

  res.status(200).json({ user });
});

export const createUser = expressAsyncHandler(async (req, res) => {
  const { name, email, phone, profileImg, password, role, active, wishlist, address } = req.body;

  const user = await UserModel.create({
    name,
    slug: slugify(name),
    email,
    phone,
    profileImg,
    password,
    role,
    active,
    wishlist,
    address,
  });
  return res.status(201).json({
    status: 201,
    message: "User created successfully",
    user,
  });
});

export const updateUser = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, profileImg, role, active, wishlist, address } = req.body;

  const updateData = {
    name,
    slug: name ? slugify(name) : undefined,
    email,
    phone,
    profileImg,
    role,
    active,
    wishlist,
    address,
  };

  Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

  const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true });

  if (!user) {
    return next(new AppError(`User not found for this id ${id}`, 404));
  }

  return res.status(200).json({
    status: 200,
    message: "User updated successfully",
    user,
  });
});

export const deleteUser = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await UserModel.findByIdAndDelete(id);

  if (!user) {
    return next(new AppError(`User not found for this id ${id}`, 404));
  }

  return res.status(204).json({
    status: 204,
    message: "User deleted successfully",
  });
});

export const changeUserPassword = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const user = await UserModel.findById(id);
  if (!user) {
    return next(new AppError(`User not found for this id ${id}`, 404));
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  console.log("isMatch : ", isMatch);

  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new AppError("New password and confirm password do not match", 400));
  }

  user.password = newPassword;
  user.refreshToken = null;
  await user.save();

  res.status(200).json({
    status: 200,
    message: "Password updated successfully",
  });
});

export const getMe = expressAsyncHandler(async (req, res) => {
  const {
    _id,
    name,
    email,
    slug,
    phone,
    profileImg,
    role,
    active,
    wishlist,
    address,
    createdAt,
    updatedAt,
  } = req.user;

  res.status(200).json({
    status: 200,
    message: "User data retrieved successfully",
    user: {
      id: _id,
      name,
      email,
      slug,
      phone,
      profileImg,
      role,
      active,
      wishlist,
      address,
      createdAt,
      updatedAt,
    },
  });
});

export const updateMe = expressAsyncHandler(async (req, res, next) => {
  const { name, phone, profileImg, address } = req.body;

  const updateData = {
    name,
    phone,
    profileImg,
    address,
  };

  Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

  if (name) {
    updateData.slug = slugify(name);
  }

  const { id } = req.user;
  const user = await UserModel.findById(id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken -passwordResetCode -passwordResetExpires");

  res.status(200).json({
    status: 200,
    message: "User updated successfully",
    user: updatedUser,
  });
});

export const changeMyPassword = expressAsyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new AppError("All password fields are required", 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError("New password must be at least 6 characters long", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new AppError("New password and confirm password do not match", 400));
  }

  const { id } = req.user;
  const user = await UserModel.findById(id).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    return next(new AppError("Current password is incorrect", 400));
  }

  user.password = newPassword;
  user.refreshToken = null;
  user.passwordChangedAt = new Date();

  await user.save();

  res.status(200).json({
    status: 200,
    message: "Password changed successfully",
  });
});
