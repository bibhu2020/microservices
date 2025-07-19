import { Module } from '@nestjs/common';
import { AzureTokenService } from './azure-token.service';

@Module({
  providers: [AzureTokenService]
})
export class AzureTokenModule {}
