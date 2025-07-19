import { Controller, Get, Render } from '@nestjs/common';

@Controller('docs')
export class DocsController {
  @Get()
  @Render('index')
  getDocsHome() {
    return { message: 'Welcome to NestJS MVC', userName: 'John Doe', roles: ['admin', 'user'], userId: 1 };
  }

  @Get('code')
  @Render('docs/code')
  getCodeFlow() {
    return { message: 'Welcome to NestJS MVC', userName: 'John Doe', roles: ['admin', 'user'], userId: 1 };
  }

  @Get('credential')
  @Render('docs/credential')
  getCredentialFlow() {
    return { message: 'Welcome to NestJS MVC', userName: 'John Doe', roles: ['admin', 'user'], userId: 1 };
  }

  @Get('implicit')
  @Render('docs/implicit')
  getImplictFlow() {
    return { message: 'Welcome to NestJS MVC', userName: 'John Doe', roles: ['admin', 'user'], userId: 1 };
  }

  @Get('password')
  @Render('docs/password')
  getPasswordFlow() {
    return { message: 'Welcome to NestJS MVC', userName: 'John Doe', roles: ['admin', 'user'], userId: 1 };
  }

  @Get('stocks')
  @Render('docs/stocks')
  getStocks() {
    return { message: 'Welcome to NestJS MVC', userName: 'John Doe', roles: ['admin', 'user'], userId: 1 };
  }
}
