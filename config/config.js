import dotenv from "dotenv";

dotenv.config();

export const config = {
  dbUrl: process.env.MONGODB_URI,
  port: process.env.PORT || 4000,
  mode: process.env.NODE_ENV || "development",

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};
