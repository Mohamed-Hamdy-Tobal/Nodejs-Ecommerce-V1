import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import { setupLogger } from "./middleware/logger.js";
import { connectDB } from "./database/dbConnection.js";
import { categoryRouter } from "./routes/category.route.js";
import { AppError, errorHandler } from "./utils/errorHandlers.js";
import { subCategoryRouter } from "./routes/subCategory.route.js";
import { brandRouter } from "./routes/brand.route.js";
import { productRouter } from "./routes/product.route.js";
import { userRouter } from "./routes/user.route.js";
import { authRouter } from "./routes/auth.route.js";

const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    setupLogger(app);

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.use("/api/v1/category", categoryRouter);
    app.use("/api/v1/sub-category", subCategoryRouter);
    app.use("/api/v1/brand", brandRouter);
    app.use("/api/v1/products", productRouter);
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/auth", authRouter);


    app.use((req, res, next) => {
      next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
    });

    app.use(errorHandler);

    const server = app.listen(config.port, () => {
      console.log(`App is running on port ${config.port} in ${config.mode} mode`);
    });

    // Handle uncaught exceptions and unhandled rejections that occur after the server has started
    // Handle Errors Outside Express
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => {
        console.error("Shutting down server due to unhandled rejection");
        process.exit(1);
      });
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// 13