// Prepare a sophisticated log that works according to the project environment (development or production), 
// and you print information about the requests that come to the server so that you can follow up and analyze any problems.
import morgan from "morgan";
import { config } from "../config/config.js";

// Here, you'll learn about a custom token called body that prints the contents of the request body.
// This means that if someone sends a POST containing data, that data will appear in the log.
morgan.token("body", (req) => JSON.stringify(req.body));

const developmentFormat = ":method :url :status :response-time ms - :body";
const productionFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]';

export const setupLogger = (app) => {
  if (config.mode === "development") {
    app.use(morgan(developmentFormat));
    console.log("Morgan logger enabled in development mode");
  } else if (config.mode === "production") {
    app.use(morgan(productionFormat));
  }
};
