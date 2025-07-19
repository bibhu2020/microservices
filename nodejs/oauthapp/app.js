import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import compression from "compression";
import cors from 'cors';
import bodyParser from 'body-parser';

import HomeRouter from "./routes/homeRouter.js";
import AuthRouter from "./routes/authRouter.js";
import AzureRouter from "./routes/azureRouter.js";
import PORouter from "./routes/poRouter.js";
import GenAIRouter from "./routes/genAIRouter.js";
import AuditRouter from "./routes/auditRouter.js";

import errorHandler from './middlewares/errorHandler.js'
import readCookie from "./middlewares/readCookie.js";
import { checkAuthStatus, checkSREAdminRole, checkSuperAdminRole } from "./middlewares/checkAuthStatus.js";
import CacheMiddleware from './middlewares/cacheMiddleware.js'; // Import the CacheMiddleware class

import path from 'path';
import { fileURLToPath } from 'url';

class Server {
  #filename = fileURLToPath(import.meta.url);
  #dirname = path.dirname(this.#filename);

  constructor() {
    logger.logTrace("Application server is starting..............");

    this.app = express();
    this.cacheMiddleware = new CacheMiddleware();
    this.configureMiddlewares();
    this.configureViewEngine();
    this.configureRoutes();

    this.exceptionHandler(); //must be last method call 
  }

  configureMiddlewares() {
    this.app.use(cors()); //enable cors for all origin
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    //this.app.use(express.static("public"));
    this.app.use(express.static(path.join(this.#dirname, 'public')));
    this.app.use(expressLayouts);
    this.app.use(bodyParser.json());// Middleware to parse JSON bodies
    this.app.use(
      compression({
        level: 6,
        threshold: 1 * 1000,
        filter: this.shouldCompress,
      })
    );
    this.app.use(session({
      secret: process.env.SESSION_SECRET || 'default_secret', // Use the secret from the environment variable
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true in production
      },
    }));
    this.app.use(cookieParser());
    this.app.use(readCookie);

    // Middleware to print the requested URL
    this.app.use((req, res, next) => {
      console.log(`Requested URL: ${req.url}`);
      next(); // Pass control to the next handler
    });
  }

  shouldCompress(req, res) {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  }

  configureViewEngine() {
    this.app.set("view engine", "ejs");
    this.app.set("views", "./views");
  }

  //set the router and view layout
  configureRoutes() {
    // Serve the Vue.js SPA at a specific route
    this.app.get('/spa', (req, res) => {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const absoluteUrl = `${protocol}://${req.get('host')}/spa`;
      const data = {
        apiUrl: process.env.API_URI,
        apiClientId: process.env.AZURE_API_CLIENT_ID,
        clientId: process.env.AZURE_SPA_CLIENT_ID,
        tenantId: process.env.AZURE_TENANT_ID,
        redirectUrl: absoluteUrl,
      };
      res.render('spa/index', { title: 'Vue.js Integrated Nodejs', data: data });
    });

    // Serve the nodejs webapp at the following routes
    this.app.use("/azure", 
      //this.cacheMiddleware.checkCache, 
      (new AzureRouter()).getRouter(this.app));
    this.app.use("/auth", 
      (new AuthRouter()).getRouter(this.app));
    this.app.use("/po", 
      checkAuthStatus, 
      checkSuperAdminRole, 
      this.cacheMiddleware.checkCache, 
      (new PORouter()).getRouter(this.app));
    this.app.use("/home", 
      this.cacheMiddleware.checkCache, 
      (new HomeRouter()).getRouter(this.app));
    this.app.use("/genai", 
      checkAuthStatus, 
      this.cacheMiddleware.checkCache,
      (new GenAIRouter()).getRouter(this.app));
    this.app.use("/audit", 
      checkAuthStatus, 
      checkSREAdminRole, 
      this.cacheMiddleware.checkCache, 
      (new AuditRouter()).getRouter(this.app));
    this.app.use("/", this.cacheMiddleware.checkCache, (new HomeRouter()).getRouter(this.app));
  }

  start() {
    const PORT = process.env.PORT || 8080;
    this.app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  }

  exceptionHandler() {
    // Error handling middleware (should be the last middleware)
    this.app.use(errorHandler);
  }
}

export default Server;