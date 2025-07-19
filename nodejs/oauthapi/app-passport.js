import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import passport from 'passport';
import { BearerStrategy } from 'passport-azure-ad';

import DefaultRouter from "./routes/defaultRouter.js";
import ApiRouter from "./routes/apiRouter.js";
import errorHandler from './middlewares/errorHandler.js'
import decodeRequest from './middlewares/decodeRequest.js'

class Server {
  constructor() {


    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.initPassport();

    this.exceptionHandler(); //must be last method call 
  }

  configureMiddlewares() {
    this.app.use(cors()); //enable cors for all origin
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(bodyParser.json());
    this.app.use(decodeRequest); //decodes each request and reads token from it.
  }

  initPassport() {
    const options = {
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_CLIENT_ID,
      validateIssuer: true,
      issuer: [`https://sts.windows.net/${process.env.AZURE_TENANT_ID}/`],
      passReqToCallback: false,
      loggingLevel: 'info',
      scope: ['access_as_user'],
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
    //authenticates the user before routing. 
    this.app.use("/api", 
              passport.authenticate('oauth-bearer', { session: false }), 
              (new ApiRouter()).getRouter(this.app));
    //annonymous access
    this.app.use("/unprotected/api",
              (new ApiRouter()).getRouter(this.app));
    this.app.use("/",
              (new DefaultRouter()).getRouter(this.app));
  }

  start() {
    const PORT = process.env.PORT || 8081;
    this.app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  }

  exceptionHandler () {
    // Error handling middleware (should be the last middleware)
    this.app.use(errorHandler);
  }

}

export default Server;
