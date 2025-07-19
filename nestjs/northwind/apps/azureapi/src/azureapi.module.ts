import { Module } from '@nestjs/common';
import { AzureApiController } from './azureapi.controller';
import { AzureApiService } from './azureapi.service';
import { AzureTokenService } from '@bpm/common';

@Module({
  imports: [],
  controllers: [AzureApiController],
  providers: [AzureApiService, AzureTokenService],
})
export class AzureapiModule {}
