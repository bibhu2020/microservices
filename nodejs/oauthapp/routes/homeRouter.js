import express from "express";
import HomeController from "../controllers/homeController.js";

//This is the default router
class homeRouter {
  constructor() {
    this.router = express.Router();
    this.homeController = new HomeController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/index', (req, res, next) => this.homeController.index(req, res, next));
    this.router.get('/code', (req, res, next) => this.homeController.code(req, res, next));
    this.router.get('/credential', (req, res, next) => this.homeController.credential(req, res, next));
    this.router.get('/implicit', (req, res, next) => this.homeController.implicit(req, res, next));
    this.router.get('/password', (req, res, next) => this.homeController.password(req, res, next));
    this.router.get('/sitemap', (req, res, next) => this.homeController.sitemap(req, res, next));
    this.router.get('/sitemap.xml', (req, res, next) => this.homeController.sitemap(req, res, next));
    this.router.get('*', (req, res, next) => this.homeController.index(req, res, next));
  }

  getRouter(app) {
    app.set("layout", "_layouts/default");
    return this.router;
  }
}

export default homeRouter;

