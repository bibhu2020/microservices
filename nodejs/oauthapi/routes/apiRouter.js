import express from "express";
import WeatherController from "../controllers/weatherController.js";
import AzureController from "../controllers/azureController.js";
import EmailController from "../controllers/emailController.js";
import GraphController from "../controllers/graphController.js";
import POController from "../controllers/poController.js";
import OpenAIController from "../controllers/openAIControllerRaw.js";
import AuditController from "../controllers/auditController.js";
import GrafanaWebhookController from "../controllers/grafanaWebhookController.js";

class ApiRouter {
  constructor() {
    this.router = express.Router();
    this.weatherController = new WeatherController();
    this.azureController = new AzureController();
    this.emailController = new EmailController();
    this.graphController = new GraphController();
    this.poController = new POController();
    this.openAIController = new OpenAIController();
    this.auditController = new AuditController();
    this.grafanaWebhookController = new GrafanaWebhookController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/weather', (req, res, next) => this.weatherController.index(req, res, next));
    this.router.get('/azure/listkvsecrets', (req, res, next) => this.azureController.listKeyVaultSecrets(req, res, next));
    
    this.router.post('/po/create', (req, res, next) => this.poController.create(req, res, next));
    this.router.delete('/po/delete/:id/:vendorName', (req, res, next) => this.poController.delete(req, res, next));
    this.router.put('/po/put/:id/:vendorName', (req, res, next) => this.poController.put(req, res, next));
    this.router.get('/po/list', (req, res, next) => this.poController.list(req, res, next));

    this.router.get('/graph/users', (req, res, next) => this.graphController.listusers(req, res, next));
    this.router.get('/graph/groups', (req, res, next) => this.graphController.listgroups(req, res, next));
    
    this.router.post('/openai/weather', (req, res, next) => this.openAIController.weatherReport(req, res, next));

    this.router.post('/email', (req, res, next) => this.emailController.sendEmail(req, res, next));
    this.router.post('/emailHtml', (req, res, next) => this.emailController.sendEmailHtml(req, res, next));
    this.router.post('/queueEmail', (req, res, next) => this.emailController.queueEmail(req, res, next));
    this.router.post('/queueEmailHtml', (req, res, next) => this.emailController.queueEmailHtml(req, res, next));

    this.router.post('/grafana/email', (req, res, next) => this.grafanaWebhookController.sendEmail(req, res, next));

    this.router.get('/audit/list', (req, res, next) => this.auditController.filterByMultipleFields(req, res, next));
  }

  getRouter(app) {
    app.set("layout", "_layouts/default");
    return this.router;
  }
}

export default ApiRouter;
