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
