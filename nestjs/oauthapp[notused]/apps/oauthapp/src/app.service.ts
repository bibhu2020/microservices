import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): Object {
    return { message: 'Welcome to NestJS MVC', userName: '', roles: ['admin', 'user'], userId: 1 };  
  }
}
