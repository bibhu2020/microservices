// Logger interface
class Logger {
    log(message) {
      throw new Error("log() must be implemented");
    }
  }
  
  // Console Logger
  class ConsoleLogger extends Logger {
    log(message) {
      console.log(`[Console]: ${message}`);
    }
  }
  
  // File Logger (simulated)
  class FileLogger extends Logger {
    log(message) {
      console.log(`[File]: Writing "${message}" to file...`);
    }
  }
  
  // Cloud Logger (simulated)
  class CloudLogger extends Logger {
    log(message) {
      console.log(`[Cloud]: Sending "${message}" to cloud log service...`);
    }
  }
  
  // Factory with Singleton
  class LoggerFactory {
    static instances = {};
  
    static createLogger(type) {
      if (!LoggerFactory.instances[type]) {
        switch (type) {
          case "console":
            LoggerFactory.instances[type] = new ConsoleLogger();
            break;
          case "file":
            LoggerFactory.instances[type] = new FileLogger();
            break;
          case "cloud":
            LoggerFactory.instances[type] = new CloudLogger();
            break;
          default:
            throw new Error("Invalid logger type");
        }
      }
  
      return LoggerFactory.instances[type];
    }
  }
  
  // Usage
  const config = { loggerType: "cloud" };
  
  const logger1 = LoggerFactory.createLogger(config.loggerType);
  logger1.log("This is a test log.");
  
  const logger2 = LoggerFactory.createLogger("cloud");
  logger2.log("Another log to cloud.");
  
  console.log(logger1 === logger2); // true — same instance
  