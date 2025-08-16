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
import { rateLimit } from "express-rate-limit";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import helmet from "helmet";

const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    /**
     * Security Middlewares
     */
    app.use(hpp()); // Prevent HTTP Parameter Pollution
    app.use(mongoSanitize()); // Prevent NoSQL Injection
    app.use(xssClean()); // Prevent XSS
    app.use(helmet()); // Set security headers

    /**
     * Rate Limiting
     */
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100,
      message: "Too many requests, please try again later.",
      standardHeaders: "draft-8",
    });
    app.use("/api", limiter);

    /**
     * Body Parsers
     */
    app.use(express.json({ limit: "20kb" }));
    app.use(express.urlencoded({ extended: true }));

    /**
     * CORS
     */
    app.use(cors());

    /**
     * Logging
     */
    setupLogger(app);

    /**
     * Routes
     */
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.use("/api/v1/category", categoryRouter);
    app.use("/api/v1/sub-category", subCategoryRouter);
    app.use("/api/v1/brand", brandRouter);
    app.use("/api/v1/products", productRouter);
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/auth", authRouter);

    /**
     * Handle 404
     */
    app.use((req, res, next) => {
      next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
    });

    /**
     * Error Handler
     */
    app.use(errorHandler);

    /**
     * Start Server
     */
    const server = app.listen(config.port, () => {
      console.log(`App is running on port ${config.port} in ${config.mode} mode`);
    });

    /**
     * Handle unhandled Promise rejections
     */
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
