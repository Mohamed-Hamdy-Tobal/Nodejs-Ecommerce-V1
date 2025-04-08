import express from "express";
import cors from "cors";
import { config } from "./config/config.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res) => {
  return res.status(404).json({
    status: 404,
    message: "this resource is not available",
  });
});

app.listen(config.port, () => {
  console.log(`app is running on port ${config.port}`);
});
