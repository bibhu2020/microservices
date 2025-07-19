import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as expressLayouts from 'express-ejs-layouts';
import { join } from 'path';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const isProduction = process.env.NODE_ENV === 'production';

  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.useStaticAssets(join(__dirname, '..','src', 'public'));
  app.use(expressLayouts); // Enable express-ejs-layouts
  app.setViewEngine('ejs');
  app.set('layout', '_layouts/default');

  //app.setGlobalPrefix('api'); // 👈 This sets /api as the prefix

  app.enableCors({
    origin: /http:\/\/localhost:\d+$/, // Allow all requests from localhost on any port
    credentials: true,                  // Enable credentials if needed (cookies, auth headers, etc.)
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key', // Replace with a secure secret
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProduction, // Use HTTPS in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    }),
  );
  app.use(cookieParser());

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
