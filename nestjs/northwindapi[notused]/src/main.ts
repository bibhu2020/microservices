import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApploggerService } from './libs/applogger/src';

async function bootstrap() {
  const context = 'bootstrap';
  const logger = new ApploggerService(context);

  logger.log('🛠️  Starting up the NestJS Application...\n', context);
  logger.log('📦 Loading modules...\n', context);

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: /http:\/\/localhost:\d+$/, // Allow all requests from localhost on any port
    credentials: true,                  // Enable credentials if needed (cookies, auth headers, etc.)
  });

  app.setGlobalPrefix('api'); // 👈 This sets /api as the prefix

  const port = process.env.PORT || 8080;

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
}
bootstrap();
