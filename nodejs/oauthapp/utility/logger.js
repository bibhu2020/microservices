import appInsights from 'applicationinsights';
import dotenv from 'dotenv';

class Logger {
    constructor() {
        dotenv.config();
        if (!Logger.instance && process.env.NODE_ENV != "development") {
          appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING)
                //helps to link related telemetry items (such as requests, dependencies, and exceptions) together to provide a comprehensive view of how an individual request flows
                .setAutoDependencyCorrelation(true)
                //tracks incoming HTTP requests to your Node.js application
                .setAutoCollectRequests(true)
                //enables the automatic collection of performance-related telemetry data
                .setAutoCollectPerformance(true)
                //enable the automatic collection of unhandled exceptions
                .setAutoCollectExceptions(true)
                //tracks calls from your application to external services or resources, such as databases, APIs, or any other external dependencies your application relies on
                .setAutoCollectDependencies(true)
                //first false disables interceptions on console.log, console.info, console.warn, second true enables interception on console.error.
                .setAutoCollectConsole(false, true) 
                //enables disk-based retry caching for telemetry data. Useful incase of network issue.This is must to have.
                .setUseDiskRetryCaching(true)
                .start();

            this.client = appInsights.defaultClient;
            Logger.instance = this;
        }

        return Logger.instance;
    }

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    logTrace(message, properties = {}) {
        if (this.instance) {
            this.client.trackTrace({ message, properties });
        }
    }

    logEvent(name, properties = {}) {
        if (this.instance) {
            this.client.trackEvent({ name, properties });
        }
    }

    logException(exception, properties = {}) {
        this.client.trackException({ exception, properties });
    }

    logMetric(name, value, properties = {}) {
        this.client.trackMetric({ name, value, properties });
    }

    logRequest(name, url, duration, resultCode, success, properties = {}) {
        this.client.trackRequest({ name, url, duration, resultCode, success, properties });
    }
}

const loggerInstance = Logger.getInstance();

// Expose the logger instance as a global object
globalThis.logger = loggerInstance;

export default loggerInstance;
