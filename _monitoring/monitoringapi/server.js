import express from "express";
import compression from "compression";
import cors from 'cors';
import expressLayouts from "express-ejs-layouts";
import DefaultRouter from "./routes/defaultRouter.js";
import ApiRouter from "./routes/apiRouter.js";
import logger from "./middleware/logger.js";

class Server {
  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureViewEngine();
    this.configureRoutes();
  }

  configureMiddlewares() {
    this.app.use(cors()); //enable cors for all origin
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("www"));
    this.app.use(expressLayouts);
    this.app.use(
      compression({
        level: 6,
        threshold: 1 * 1000,
        filter: this.shouldCompress,
      })
    );
    // Use the RequestLogger middleware for every incoming request
    this.app.use(logger);
  }

  shouldCompress(req, res) {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  }

  configureViewEngine() {
    this.app.set("view engine", "ejs");
    this.app.set("views", "./mvc/views");
  }

  configureRoutes() {
    this.app.use("/api", (new ApiRouter()).getRouter());
    this.app.use("/", (new DefaultRouter()).getRouter());
  }

  start() {
    const PORT = process.env.PORT || 8080;
    this.app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  }
}

export default Server;
