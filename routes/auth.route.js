import express from "express";
import { registerValidation } from "../validation/authValidation.js";
import { register } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/register", registerValidation, register);


export const authRouter = router;
