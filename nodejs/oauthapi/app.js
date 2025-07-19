import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import passport from 'passport';
import { BearerStrategy } from 'passport-azure-ad';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
//import YAML from 'yamljs';
//import pkg from 'express-openapi-validator';
//const { OpenApiValidator } = pkg;

import DefaultRouter from "./routes/defaultRouter.js";
import ApiRouter from "./routes/apiRouter.js";
import errorHandler from './middlewares/errorHandler.js'
import {decodeRequest, autorizeRequest, checkScopeAndRole} from './middlewares/authorize.js'
//import checkRole from './middlewares/checkRole.js'
import CacheMiddleware from './middlewares/cacheMiddleware.js'; // Import the CacheMiddleware class

class Server {
  constructor() {

    this.app = express();
    this.configureMiddlewares();
    this.cacheMiddleware = new CacheMiddleware();
    this.configureRoutes();
    this.initPassport();

    this.exceptionHandler(); //must be last method call 

    // Swagger definition
    const options = {
      definition: {
          openapi: '3.0.0',
          info: {
              title: 'OAuth API',
              version: '1.0.0',
              description: 'OAuth PoC APIs',
          },
      },
      apis: ['./*.js'], // Path to the API docs (your source files)
    };

    this.swaggerSpec = swaggerJsdoc(options);

  }

  configureMiddlewares() {
    this.app.use(cors()); //enable cors for all origin
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data (form data)
    this.app.use(morgan('dev'));
    this.app.use(bodyParser.json());
    this.app.use(decodeRequest); //decodes each request and reads token from it.

    // // Middleware for request/response validation
    // this.app.use(
    //   OpenApiValidator.middleware({
    //       apiSpec: './openapi.yaml', // Path to your OpenAPI spec
    //       validateRequests: true,     // (default)
    //       validateResponses: false,   // Set to true to validate responses too
    //   })
    // );

    // // Error handling middleware for validation errors
    // this.app.use((err, req, res, next) => {
    //   if (err instanceof OpenApiValidator.ValidationError) {
    //       return res.status(400).json(err.errors);
    //   }
    //   next();
    // });
  }

  initPassport() {
    const options = {
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_CLIENT_ID,
      validateIssuer: true,
      issuer: [`https://sts.windows.net/${process.env.AZURE_TENANT_ID}/`],
      passReqToCallback: false,
      loggingLevel: 'info',
      //scope: ['access_as_user'],
      audience: `api://${process.env.AZURE_CLIENT_ID}`
    };

    const bearerStrategy = new BearerStrategy(options, (token, done) => {
      //console.log("accessToken recevied by API: " + token);
      if (!token.oid) {
        return done(new Error('oid is not found in token'));
      }
      done(null, token);
    });

    //passport-azure-ad supports 2 strategies. 
    //OIDCStrategy prompts user to authenticate
    //BearerStrategy takes bearer token to authenticate
    passport.use(bearerStrategy);
    this.app.use(passport.initialize());
  }

  //set the router and view layout
  configureRoutes() {
    // Serve Swagger UI
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.swaggerSpec));

    //authorize the user using bearer token "Authorization Bearer <jwt>"
    this.app.use("/api", 
      autorizeRequest, checkScopeAndRole("api.read", "access_as_user"),
  //    this.cacheMiddleware.checkCache, 
      (new ApiRouter()).getRouter(this.app));

    //authorize the user using apikey "Authorization ApiKey <key>"
    this.app.use("/key/api", 
      autorizeRequest, 
      //this.cacheMiddleware.checkCache, 
      (new ApiRouter()).getRouter(this.app));

    //annonymous access
    this.app.use("/unauthorized/api",
      this.cacheMiddleware.checkCache, 
      (new ApiRouter()).getRouter(this.app));

    this.app.use("/",
      this.cacheMiddleware.checkCache, 
      (new DefaultRouter()).getRouter(this.app));
  }

  start() {
    const PORT = process.env.PORT || 8081;
    this.app.listen(PORT, () => {
      console.log(`API server is running at http://localhost:${PORT}`);
      console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
    });
  }

  exceptionHandler () {
    // Error handling middleware (should be the last middleware)
    this.app.use(errorHandler);
  }

}

export default Server;
