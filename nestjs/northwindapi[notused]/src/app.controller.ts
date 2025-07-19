import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller(['/', '/healthz'])
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthz(): string {
    return this.appService.healthz();
  }
}
