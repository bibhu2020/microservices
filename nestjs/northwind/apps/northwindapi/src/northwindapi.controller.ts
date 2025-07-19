import { Controller, Get } from '@nestjs/common';
import { NorthwindapiService } from './northwindapi.service';

@Controller(['/', '/healthz'])
export class NorthwindapiController {
  constructor(private readonly northwindapiService: NorthwindapiService) {}

  @Get()
  healthz(): string {
    return this.northwindapiService.healthz();
  }
}
