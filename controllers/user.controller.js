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
