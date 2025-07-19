import { NestFactory } from '@nestjs/core';
import { ApigatewayModule } from './apigateway.module';
import { ApploggerService } from '@bpm/common';

async function bootstrap() {
  const context = 'apigateway';
  const logger = new ApploggerService(context);

  logger.log('🛠️  Starting up the NestJS Application...\n', context);
  logger.log('📦 Loading modules...\n', context);

  const app = await NestFactory.create(ApigatewayModule);

  app.enableShutdownHooks(); // 👈 Add this


  app.enableCors({
    origin: [/http:\/\/localhost:\d+$/, 'https://srepoc-northwind-vuejs-ctbmh6bufhgufqea.b01.azurefd.net'], // Allow all requests from localhost on any port
    credentials: true, // Enable credentials if needed (cookies, auth headers, etc.)
  });

  app.setGlobalPrefix('api'); // 👈 This sets /api as the prefix

  const port = process.env.PORT || 3001;

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
