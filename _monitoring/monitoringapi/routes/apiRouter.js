import express from "express";
import DefenderController from "../mvc/controllers/api/defenderController.js";
import AzureController from "../mvc/controllers/api/azureController.js";
import AssignmentController from "../mvc/controllers/api/assignmentController.js";

class ApiRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/assignments", (req, res) => {
      const controller = new AssignmentController();
      controller.listAlerts(req, res);
    });

    this.router.get("/defender", (req, res) => {
      const controller = new DefenderController();
      controller.listAlerts(req, res);
    });

    this.router.get("/azure", (req, res) => {
        const controller = new AzureController();
        controller.listResourceGroups(req, res);
    });

    this.router.get("/", (req, res) => {
      const controller = new DefenderController();
        controller.listAlerts(req, res);
    });
  }

  getRouter() {
    return this.router;
  }
}

export default ApiRouter;
