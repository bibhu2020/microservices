import express from "express";
import HomeController from "../controllers/homeController.js";

class DefaultRouter {
  constructor() {
    this.router = express.Router();
    this.homeController = new HomeController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('*', (req, res, next) => this.homeController.index(req, res, next));
  }

  getRouter(app) {
    app.set("layout", "_layouts/default");
    return this.router;
  }
}

export default DefaultRouter;
