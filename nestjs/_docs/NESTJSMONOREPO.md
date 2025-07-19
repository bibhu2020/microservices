# Objective 
Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

Here, we will be learning NESTJS by setting up the following app monorepo. It will have the following list of applications. 

Northwind
- /libs
- /libs/common
- /libs/db/northwind - db layer to northwind postress db. It also holds the models
- /apps/northwind
- /apps/apigateway
- /apps/northwindapi - grpc microservice for northwind business (controllers + services)
- /apps/azureapi - gprc microservice for accessing azure resources
- /apps/weatherapi - http microservice for reading weather
- /apps/email - queue microservice for sending email

## Setting up NestJS Environment
```bash
npm i -g @nestjs/cli

```

## Create Root Project 
```bash
nest new northwind

npm i --save @nestjs/microservices
```

### Add the additional applications (sub-app) to it. (adds app to monorepo)
when you do this, all application move under /apps folder.
```bash
nest generate app apigateway
nest generate app weatherapi
nest generate app northwindapi
```

**Note:** nest-cli.json contains a property called "root" that tells you which is the default application in the list. when you run the command like "npm run start" without any extra parameter, it executes the default application.
```json
  "monorepo": true,
  "root": "apps/northwind",

```

if you need to run any other app, you have to pass its name explictly. Example:
```bash
npm run start weatherapi

```


### Running or Building all application together
Nestjs does not provide out of box support to concurrent run today. Hence, we will install the following package.
```bash
npm install concurrently
```

Now you make script entries into your package.json for each app. And entry to run or build them together.
```json
    "start-dev": "concurrently -c \"cyan.bold,red.bold,yellow.bold,blue.bold\" \"npm:start-dev:*\"",
    "start-dev:northwind": "npx ts-node-dev -r tsconfig-paths/register apps/northwind/src/main.ts",
    "start-dev:apigateway": "npx ts-node-dev -r tsconfig-paths/register apps/apigateway/src/main.ts",
    "start-dev:weatherapi": "npx ts-node-dev -r tsconfig-paths/register apps/weatherapi/src/main.ts",
    "start-dev:northwindapi": "npx ts-node-dev -r tsconfig-paths/register apps/northwindapi/src/main.ts",
```

`npm run start:dev` starts all the 3 apps together (runs all npm scripts that starts with start-dev:*). It also adds color to distinguish the app logs.

**Note:** 
- Make sure each app is configured to run on a different port.
- **_npx ts-node-dev _** executes the *.ts file from src/ folder. This is recommedned in development mode.
- **nest start** builds the code into *.js in dist folder and runs from there.

### Add library project to the monorepo (library that holds code common to all the apps)
```bash
nest generate lib common

nest generate lib data

```
All libraries are added under a folder called "libs". When creating a library, it prompts you create a prefix to refer to them (by default its @app). In my case, I will give it a name '@bpm'.

**Note** Monorepo code with libs does not look nice in folder strucutre after build. In case you want make it beautiful, you must use Nx library.

--------------------------------------------------------

## Adding resources (controller, middleware, module, service) to a sub-app in monorepo
```bash
nest g module circuitbraker --project apigateway

nest g service circuitbraker --project apigateway

```

## Creating a gRPC Microservice
For demo, here I am creating a gRPC service called "azureapi". This would be responsible to interact with azure resources. It will read KV, and Storage. It also writes/reads from Azure Service Bus.

It is also going to have functionality to interact with RabbitMQ. (as an alternative to Azure Service Bus)

The service "azureapi" will br exposed to users via the "apigateway" service. The "apigateway" interacts with gRPC service "azureapi". The "apigateway" being a RESTAPI, it can be accessed via browser and user applictions. gRPC is not accessible via browser. It's only for server to server communication.

### Step1: Add the gRPC app to the monorepo and add required packages

```bash
nest generate app azureapi
```

gRPC defines its contract (for client to consume) in **_.proto_** file.  With the gRPC transporter, Nest uses .proto files to dynamically bind clients and servers to make it easy to implement remote procedure calls, automatically serializing and deserializing structured data.

```bash
npm install @nestjs/microservices @grpc/grpc-js @grpc/proto-loader


```

### Step2: Create the .proto file (or called service contract)

Because the .proto file is going to be used both by the client (apigateway) and the server (azureapi), I am going to place the file in a folder of the root of monorepo. (say libs/proto/azureapi.proto)
```proto
syntax = "proto3";

package azureapi;

service AzureApiService {
  rpc readSecret (SecretRequest) returns (SecretResponse);
}
message SecretRequest {
  string kvName = 1;
  string secretName = 2;
}
message SecretResponse {
  string kvName = 1;
  string secretName = 2;
  string secretValue = 3;
}
message ErrorResponse {
  string error = 1;
}

```

### Step4: Write the gRPC microservice

```js
//main.ts
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

```

```js
//azureapi.controller.ts

import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AzureApiService } from './azureapi.service';

@Controller()
export class AzureApiController {
  constructor(private readonly azureApiService: AzureApiService) {}
  

  @GrpcMethod('AzureApiService', 'readSecret') // <== Matches proto service & method
  readSecret(data: { kvName: string; secretName: string }) {
    const { kvName, secretName } = data;
    return this.azureApiService.readSecret({ kvName, secretName });
  }
}

```

### Step5: Write the gRPC client

```ts
//main.ts
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

```

```js
//controller
import { Controller, Get, Inject, OnModuleInit, Query } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface AzureApiService {
  readSecret(data: { kvName: string; secretName: string }): Observable<{
    kvName: string;
    secretName: string;
    secretValue: string;
  }>;
}

@Controller('azure')
export class AzureController implements OnModuleInit {
  private grpcService: AzureApiService;

  constructor(@Inject('AZURE_API_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.grpcService = this.client.getService<AzureApiService>('AzureApiService');
  }

  @Get('secret')
  async getSecret(@Query('kv') kv: string, @Query('secret') secret: string) {
    return this.grpcService.readSecret({ kvName: kv, secretName: secret });
  }
}

```

**Note**: Both the server and client refers to the same proto file.

## Adding modules and services to libs in a monorepo
```bash
nest g module AzureToken

nest g service AzureToken
```

This will prompt and ask you where you want to add the module or service. It lists you the project and library name.