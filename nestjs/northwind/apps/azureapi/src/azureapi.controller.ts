// azureapi.controller.ts
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
