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
      // Simulating writing to file
      console.log(`[File]: Writing "${message}" to file...`);
    }
  }
  
  // Cloud Logger (simulated)
  class CloudLogger extends Logger {
    log(message) {
      // Simulating sending to cloud
      console.log(`[Cloud]: Sending "${message}" to cloud log service...`);
    }
  }
  
  // Factory
  class LoggerFactory {
    static createLogger(type) {
      switch (type) {
        case "console":
          return new ConsoleLogger();
        case "file":
          return new FileLogger();
        case "cloud":
          return new CloudLogger();
        default:
          throw new Error("Invalid logger type");
      }
    }
  }
  
  // Usage
  const config = { loggerType: "cloud" }; // could come from env vars or a config file
  const logger = LoggerFactory.createLogger(config.loggerType);
  
  // Now just use the logger, without caring how it works under the hood
  logger.log("This is a test log.");
  