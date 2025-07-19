import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

// Ensure the logs directory exists
const logDir = '_logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, errors } = format;

// Define custom format for logs
const myFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
    level: 'warn', // Log level (info, warn, error, etc.)
    format: combine(
        timestamp(), // Add timestamp to logs
        errors({ stack: true }), // Log stack trace for errors
        myFormat // Use custom format
    ),
    transports: [
        new transports.Console(), // Log to console
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }), // Log errors to a file
        new transports.File({ filename: path.join(logDir, 'combined.log') }) // Log all levels to a file
    ]
});

export default logger;
