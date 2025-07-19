import { ApploggerService } from '@bpm/common';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: ApploggerService) {}

  use(req: any, res: any, next: () => void) {
    // Make sure to log relevant request details
    this.logger.log(`[${req.method}] ${req.originalUrl}`, "apigateway"); // Log method and URL
    // Log headers or any other information if needed
    //this.logger.log(`Headers: ${JSON.stringify(req.headers)}`, "apigateway");
    next();
  }
}
