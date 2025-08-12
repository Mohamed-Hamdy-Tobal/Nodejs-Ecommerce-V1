import express from "express";
import { loginValidation, registerValidation, forgetPasswordValidation, resetPasswordValidation, verifyOTPValidation } from "../validation/authValidation.js";
import { login, refreshToken, register, forgetPassword, verifyOTP, resetPassword, logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/refresh-token", refreshToken);
router.post("/forget-password", forgetPasswordValidation, forgetPassword);
router.post("/verify-otp", verifyOTPValidation, verifyOTP);
router.post("/reset-password", resetPasswordValidation, resetPassword);
router.post("/logout", protect, logout);

export const authRouter = router;
