import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ApploggerService } from '@bpm/common';
import { WeatherApiModule } from './weatherapi.module';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const context = 'weatherapi';
  const logger = new ApploggerService(context);
  
  const isProd = process.env.NODE_ENV === 'production';
  const protoPath = isProd
            ? '../../libs/proto/weatherapi.proto'
            : '../../../libs/proto/weatherapi.proto';

  console.log('protoPath', join(__dirname, protoPath));

  const port = process.env.PORT || 3022;
  const hostingURL = 'localhost:' + port;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(WeatherApiModule, {
      transport: Transport.GRPC,
      options: {
          package: 'weatherapi',
          protoPath: join(__dirname, protoPath),
          url: hostingURL,
        },
    });
  
    logger.log('🛠️  Starting up the NestJS Application...\n', context);
    
    await app.listen();
  
    logger.log('✅ App Modules initialized successfully\n', context);
    logger.log('🌐 Enabling global configurations...\n', context);
    logger.log('📡 Ready to accept incoming requests!\n', context);
    logger.log('🧠 Powered by NestJS ❤️\n', context);

}
bootstrap();
