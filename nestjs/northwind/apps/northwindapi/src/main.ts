import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NorthwindapiModule } from './northwindapi.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApploggerService } from '@bpm/common';
import * as dotenv from 'dotenv';
import * as express from 'express';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const context = 'northwindapi';
  const logger = new ApploggerService(context);

  logger.log('🛠️  Starting up the NestJS Application...\n', context);
  logger.log('📦 Loading modules...\n', context);

  const app = await NestFactory.create(NorthwindapiModule);

  // enable dto validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // enables class-transformer
  }));

  //disable the dto validation
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));


  app.enableCors({
    origin: [/http:\/\/localhost:\d+$/], // Allow all requests from localhost on any port
    credentials: true, // Enable credentials if needed (cookies, auth headers, etc.)
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: '*',
  });

  app.setGlobalPrefix('api'); // 👈 This sets /api as the prefix

  app.use(express.json());


  const config = new DocumentBuilder()
    .setTitle('Northwind API')
    .setDescription('Northwind API description')
    .setVersion('1.0')
    .addTag('northwind')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  const port = process.env.PORT || 3002;

  try {
    await app.listen(port, () => {
      logger.log('✅ App Modules initialized successfully\n', context);
      logger.log('🌐 Enabling global configurations...\n', context);

      logger.log(
        `🚀 Application is running at: http://localhost:${port}\n`,
        context,
      );
      logger.log('📡 Ready to accept incoming requests!\n', context);
      logger.log('🧠 Powered by NestJS ❤️\n', context);
    });
  } catch (err) {
    logger.error('❌ Failed to start application\n', err.stack);
    if (app) {
      await app.close();
    }
  }

  // OS signal listeners (optional)
  process.on('SIGINT', async () => {
    logger.warn('🛑 SIGINT received. Gracefully shutting down...', context);
    await app.close();
    process.exit(1);
  });

  process.on('SIGTERM', async () => {
    logger.warn('🛑 SIGTERM received. Gracefully shutting down...', context);
    await app.close();
    process.exit(1);
  });
}
bootstrap();
