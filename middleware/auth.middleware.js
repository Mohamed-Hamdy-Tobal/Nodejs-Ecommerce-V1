import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { config } from "../config/config.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]?.replace(/^"|"$/g, "");

    try {
      const decoded = jwt.verify(token, config.jwt.secret);

      const user = await UserModel.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      console.log("user : ", user);
      console.log("decoded : ", decoded);
      console.log("user.passwordChangedAt : ", user.passwordChangedAt);

      const tokenIssuedAt = new Date(decoded.iat * 1000);
      const passwordChangedAt = new Date(user.passwordChangedAt);
      console.log("tokenIssuedAt : ", tokenIssuedAt);
      console.log("passwordChangedAt : ", passwordChangedAt);

      if (passwordChangedAt > tokenIssuedAt) {
        console.log("Password was changed after token was issued - REJECTING");
        return res.status(401).json({
          status: 401,
          message: "Password was changed recently. Please login again.",
        });
      }
      req.user = user;
      return next();
    } catch (error) {
      console.log("error : ", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please log in again" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

export const adminProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]?.replace(/^"|"$/g, "");

    try {
      const decoded = jwt.verify(token, config.jwt.secret);

      const user = await UserModel.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      console.log("user : ", user);
      console.log("decoded : ", decoded);
      console.log("user.passwordChangedAt : ", user.passwordChangedAt);

      const tokenIssuedAt = new Date(decoded.iat * 1000);
      const passwordChangedAt = new Date(user.passwordChangedAt);
      console.log("tokenIssuedAt : ", tokenIssuedAt);
      console.log("passwordChangedAt : ", passwordChangedAt);

      if (passwordChangedAt > tokenIssuedAt) {
        console.log("Password was changed after token was issued - REJECTING");
        return res.status(401).json({
          status: 401,
          message: "Password was changed recently. Please login again.",
        });
      }
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
      }

      req.user = user;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please log in again" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};
