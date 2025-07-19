import express from "express";
import AuthController from "../controllers/authController.js";

class AuthRouter {
  constructor() {
    this.router = express.Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/login', (req, res, next) => this.authController.login(req, res, next));
    this.router.get('/logout', (req, res, next) => this.authController.logout(req, res, next));
    this.router.get('/callback', (req, res, next) => this.authController.callback(req, res, next));
    this.router.get('/profile', (req, res, next) => this.authController.profile(req, res, next));
    this.router.post('/refresh-token', (req, res, next) => this.authController.refreshToken(req, res, next));
  }

  getRouter(app) {
    app.set("layout", "_layouts/default");
    return this.router;
  }
}

export default AuthRouter;
