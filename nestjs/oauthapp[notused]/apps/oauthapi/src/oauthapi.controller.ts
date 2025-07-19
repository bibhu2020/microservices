import { Controller, Get } from '@nestjs/common';
import { OauthapiService } from './oauthapi.service';

@Controller()
export class OauthapiController {
  constructor(private readonly oauthapiService: OauthapiService) {}

  @Get()
  getHello(): string {
    return this.oauthapiService.getHello();
  }
}
