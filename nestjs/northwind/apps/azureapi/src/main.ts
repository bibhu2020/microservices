import { NestFactory } from '@nestjs/core';
import { AzureapiModule } from './azureapi.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ApploggerService } from '@bpm/common';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const context = 'azureapi';
  const logger = new ApploggerService(context);
  
  const isProd = process.env.NODE_ENV === 'production';
  const protoPath = isProd
            ? '../../libs/proto/azureapi.proto'
            : '../../../libs/proto/azureapi.proto';

  //console.log('protoPath', join(__dirname, protoPath));

  const port = process.env.PORT || 3021;
  const hostingURL = 'localhost:' + port;

  NestFactory.createMicroservice<MicroserviceOptions>(AzureapiModule, {
    transport: Transport.GRPC,
    options: {
      package: 'azureapi',
      protoPath: join(__dirname, protoPath),
      url: hostingURL,
    },
  })
    .then(app => {
      logger.log('🛠️  Starting up the NestJS Application...\n', context);

      return app.listen().then(() => {
        logger.log('✅ App Modules initialized successfully\n', context);
        logger.log('🌐 Enabling global configurations...\n', context);
        logger.log('📡 Ready to accept incoming requests!\n', context);
        logger.log('🧠 Powered by NestJS ❤️\n', context);
      });
    })
    .catch(err => {
      logger.error('❌ Failed to start WeatherAPI microservice: ' + err, context);
      process.exit(1);
    });

}
bootstrap();
