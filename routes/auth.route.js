import express from "express";
import { loginValidation, registerValidation } from "../validation/authValidation.js";
import { login, refreshToken, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/refresh-token", refreshToken);

export const authRouter = router;
