import dotenv from "dotenv";

dotenv.config();

export const config = {
  dbUrl: process.env.MONGODB_URI,
  port: process.env.PORT || 4000,
  mode: process.env.NODE_ENV || "development",

  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};
