// Logger.js
import winston from 'winston';

let instance = null;

class Logger {
  constructor() {
    if (!instance) {
      this.logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
          new winston.transports.Console(),
          //new winston.transports.File({ filename: 'logfile.log' })
        ]
      });
      instance = this;
    }

    return instance;
  }

  log(req, res, next) {
    this.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Call the next middleware in the chain
  }

  info(message) {
    this.logger.info(message);
  }

  error(message) {
    this.logger.error(message);
  }
}

class LogMiddleware {
  // Middleware function to log information about every incoming request
  static log(req, res, next) {
    //const logger = new Logger();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Call the next middleware in the chain
  }
}

//const logger = new Logger();
export default LogMiddleware.log;
