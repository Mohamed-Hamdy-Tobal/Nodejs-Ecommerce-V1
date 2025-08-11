import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn || "30m", // Default to 30 minutes if not set
  });

  const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn || "7d", // Default to 7 days if not set
  });

  return { accessToken, refreshToken };
};

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};
