import dotenv from "dotenv";

dotenv.config();

export const config = {
  dbUrl: process.env.MONGO_URL,
  port: process.env.PORT || 4000,
  mode: process.envNODE_EVN || "development",
};
