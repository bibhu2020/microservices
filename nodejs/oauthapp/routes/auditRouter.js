import express from "express";
import AuditController from "../controllers/auditController.js";

class AzureRouter {
  constructor() {
    this.router = express.Router();
    this.auditController = new AuditController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/list', (req, res, next) => this.auditController.list(req, res, next));
    this.router.get('/list/protected', (req, res, next) => this.auditController.list_protected(req, res, next));

  }

  getRouter(app) {
    app.set("layout", "_layouts/default");
    return this.router;
  }
}

export default AzureRouter;
