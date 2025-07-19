import express from "express";
import path from "path";
import AksController from "../mvc/controllers/aksController.js";
import AppController from "../mvc/controllers/appController.js";
const aksController = new AksController();
const appController = new AppController();

class DefaultRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Set the middleware to use default template while rendering the view
    this.router.all("/*", (req, res, next) => {
      req.app.set("layout", "_layouts/default");
      next();
    });

    this.router.get('/akshealth', aksController.index);
    this.router.get('*', appController.index);

    // this.router.get("/akshealth/", (req, res) => {
    //   aksController(req, res);
    // });

    // this.router.get("*", (req, res) => {
    //   appController(req, res);
    // });
  }

  getRouter() {
    return this.router;
  }
}

export default DefaultRouter;
