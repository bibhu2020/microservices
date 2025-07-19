import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(@Res() res: Response) {
    return res.render(
      "index",
      this.appService.getHome(),
    );
  }

  @Get("/index")
  @Render('index') // Looks for views/index.ejs
  index() {
    return this.appService.getHome();
  }
}
