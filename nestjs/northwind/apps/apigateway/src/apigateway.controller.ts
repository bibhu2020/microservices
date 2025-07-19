import { Controller, Req, Res, All, Get, Post } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller(['/', '/healthz'])
export class ApigatewayController {

  @Get()
  async healthz(@Req() req: Request, @Res() res: Response) {
    console.log('Request received:', req.method, req.url);
    res.send('🚀 ApiGateway is running...............');
  }

  @All()
  async test(@Req() req: Request, @Res() res: Response) {
    console.log('POST Request received:', req.method, req.url);
    res.send('🚀 ApiGateway is running...............');
  }

}
