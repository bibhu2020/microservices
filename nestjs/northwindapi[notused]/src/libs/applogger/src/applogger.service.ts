import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class ApploggerService extends ConsoleLogger {
  private MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  private LOG_DIR = path.join(process.cwd(), 'logs');
  private LOG_FILE = path.join(this.LOG_DIR, 'application.log');

  async logToFile(entry) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/Chicago',
    }).format(new Date())}\t${entry}\n`;

    try {
      // Ensure the logs directory exists
      if (!fs.existsSync(this.LOG_DIR)) {
        await fsPromises.mkdir(this.LOG_DIR, { recursive: true });
      }

      // Check if log file exists and get its size
      if (fs.existsSync(this.LOG_FILE)) {
        const { size } = await fsPromises.stat(this.LOG_FILE);

        // Rotate if size exceeds 5MB
        if (size >= this.MAX_FILE_SIZE) {
          const now = new Date();
          const timestamp = now.toISOString().replace(/[:.]/g, '-');
          const rotatedFile = path.join(
            this.LOG_DIR,
            `application-${timestamp}.log`,
          );
          await fsPromises.rename(this.LOG_FILE, rotatedFile);
        }
      }

      // Append new log entry
      await fsPromises.appendFile(this.LOG_FILE, formattedEntry);
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }

  log(message: any, context?: string) {
    const entry = `${context}\t${message}`;
    this.logToFile(entry);
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}`;
    this.logToFile(entry);
    super.error(message, stackOrContext);
  }
}
