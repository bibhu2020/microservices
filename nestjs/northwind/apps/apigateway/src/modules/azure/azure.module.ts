import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AzureController } from './azure.controller';

const isProd = process.env.NODE_ENV === 'production';
const protoPath = isProd
            ? '../../../libs/proto/azureapi.proto'
            : '../../../../../libs/proto/azureapi.proto';

//console.log('protoPath', join(__dirname, protoPath));
const port = process.env.PORT || 3021;
const apiURL = isProd
    ? process.env.PROD_AZUREAPI_URL || 'weatherapi-nestjs-service.riskiq.svc.cluster.local'
    : 'localhost:' + port;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AZURE_API_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'azureapi',
          protoPath: join(__dirname, protoPath), // 👈 Adjust if needed
          url: apiURL, // 👈 Adjust to your gRPC server host/port
        },
      },
    ]),
  ],
  controllers: [AzureController]
})
export class AzureModule {}
