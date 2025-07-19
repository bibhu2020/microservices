import express from "express";
import GenAIController from "../controllers/genAIController.js";

//This is the default router
class GenAIRouter {
  constructor() {
    this.router = express.Router();
    this.genAIController = new GenAIController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/loganalysis', (req, res, next) => this.genAIController.loganalysis(req, res, next));
    this.router.get('/translate', (req, res, next) => this.genAIController.translate(req, res, next));
    this.router.get('/chat', (req, res, next) => this.genAIController.chat(req, res, next));
  }

  getRouter(app) {
    app.set("layout", "_layouts/default");
    return this.router;
  }
}

export default GenAIRouter;

