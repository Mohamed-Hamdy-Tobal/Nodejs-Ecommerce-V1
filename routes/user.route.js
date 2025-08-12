import express from "express";
import {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getMe,
  updateMe,
  changeMyPassword,
} from "../controllers/user.controller.js";
import {
  getUserValidation,
  createUserValidation,
  updateUserValidation,
  deleteUserValidation,
  changeUserPasswordValidation,
  updateMeValidation,
  changeMyPasswordValidation,
} from "../validation/userValidation.js";
import { adminProtect, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ===== AUTHENTICATED USER ROUTES (using protect middleware) =====

// GET /users/me - Get current user data by token
router.get("/me", protect, getMe);

// PUT /users/me - Update current user data by token
router.put("/me", protect, updateMeValidation, updateMe);

// PUT /users/me/change-password - Change current user password by token
router.put("/me/change-password", protect, changeMyPasswordValidation, changeMyPassword);

// ===== ADMIN ROUTES (using adminProtect middleware) =====

// GET /users - Get all users
router.get("/", adminProtect, getAllUsers);

// GET /users/:id - Get a single user by ID
router.get("/:id", adminProtect, getUserValidation, getSingleUser);

// POST /users - Create a new user
router.post("/", adminProtect, createUserValidation, createUser);

// PUT /users/:id - Update a user by ID
router.put("/:id", adminProtect, updateUserValidation, updateUser);

// PUT /users/:id/change-password - change a user password
router.put("/:id/change-password", adminProtect, changeUserPasswordValidation, changeUserPassword);

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", adminProtect, deleteUserValidation, deleteUser);

export const userRouter = router;
