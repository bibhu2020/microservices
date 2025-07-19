import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

const isProd = process.env.NODE_ENV === 'production';
const protoPath = isProd
            ? '../../../libs/proto/weatherapi.proto'
            : '../../../../../libs/proto/weatherapi.proto';

//console.log('protoPath', join(__dirname, protoPath));
const port = process.env.PORT || 3022;
const apiURL = isProd
    ? process.env.PROD_WEATHERAPI_URL || 'weatherapi-nestjs-service.riskiq.svc.cluster.local'
    : 'localhost:' + port;



@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WEATHER_API_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'weatherapi',
          protoPath: join(__dirname, protoPath), // 👈 Adjust if needed
          url: apiURL, // 👈 Adjust to your gRPC server host/port
        },
      },
    ]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService]
})
export class WeatherModule {}
