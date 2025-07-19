import { Injectable } from '@nestjs/common';

@Injectable()
export class NorthwindapiService {
  healthz(): string {
    return '🚀 Service is up and running.....';
  }
}
