import express from "express";
import AzureController from "../controllers/azureController.js";

class AzureRouter {
  constructor() {
    this.router = express.Router();
    this.azureController = new AzureController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/readKv', (req, res, next) => this.azureController.listKvSecrets(req, res, next));
    this.router.get('/readKv/protected', (req, res, next) => this.azureController.listKvSecrets_protected(req, res, next));
    this.router.get('/weather', (req, res, next) => this.azureController.weather(req, res, next));
    this.router.get('/weatheropenai', (req, res, next) => this.azureController.weatheropenai(req, res, next));
    this.router.get('/weather/protected', (req, res, next) => this.azureController.weather_protected(req, res, next));
    this.router.get('/users', (req, res, next) => this.azureController.users(req, res, next));
    this.router.get('/users/protected', (req, res, next) => this.azureController.users_protected(req, res, next));
    this.router.get('/send-email', (req, res, next) => this.azureController.getemail(req, res, next));
    this.router.post('/send-email', (req, res, next) => this.azureController.postemail(req, res, next));
  }

  getRouter(app) {
    app.set("layout", "_layouts/default");
    return this.router;
  }
}

export default AzureRouter;
