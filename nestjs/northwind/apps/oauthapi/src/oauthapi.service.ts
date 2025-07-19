import { Injectable } from '@nestjs/common';

@Injectable()
export class OauthapiService {
  getHello(): string {
    return 'Hello World!';
  }
}
