import express from "express";
import POController from "../controllers/poController.js";

//This is the default router
class PORouter {
  constructor() {
    this.router = express.Router();
    this.poController = new POController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/list', (req, res, next) => this.poController.polist(req, res, next));
    this.router.get('/index', (req, res, next) => this.poController.index(req, res, next));
    this.router.get('/', (req, res, next) => this.poController.index(req, res, next));
  }

  getRouter(app) {
    app.set("layout", "_layouts/default");
    return this.router;
  }
}

export default PORouter;

