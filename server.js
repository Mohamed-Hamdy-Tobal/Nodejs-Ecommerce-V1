import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import { setupLogger } from "./middleware/logger.js";
import { connectDB } from "./database/dbConnection.js";
import { categoryRouter } from "./routes/category.route.js";

const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    setupLogger(app);

    // Server Routes
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.use("/api/v1/category", categoryRouter);

    // Handle Not Found Routes
    app.use((req, res) => {
      return res.status(404).json({
        status: 404,
        message: "this resource is not available",
      });
    });

    app.listen(config.port, () => {
      console.log(
        `App is running on port ${config.port} in ${config.nodeEnv} mode`
      );
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// mobin
// dribble
// behance
