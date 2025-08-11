import express from "express";
import {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
} from "../controllers/user.controller.js";
import {
  getUserValidation,
  createUserValidation,
  updateUserValidation,
  deleteUserValidation,
  changeUserPasswordValidation,
} from "../validation/userValidation.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /users - Get all users
router.get("/", protect, getAllUsers);

// GET /users/:id - Get a single user by ID
router.get("/:id", getUserValidation, getSingleUser);

// POST /users - Create a new user
router.post("/", createUserValidation, createUser);

// PUT /users/:id - Update a user by ID
router.put("/:id", updateUserValidation, updateUser);

// PUT /users/:id/change-password - change a user password
router.put("/:id/change-password", changeUserPasswordValidation, changeUserPassword);

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", deleteUserValidation, deleteUser);

export const userRouter = router;
