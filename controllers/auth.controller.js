import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

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

  const token = generateToken(user._id);

  res.status(201).json({
    status: 201,
    message: "User created successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      slug: user.slug,
    },
  });
});
