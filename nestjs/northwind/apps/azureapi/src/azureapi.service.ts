import { Injectable } from '@nestjs/common';
import { AzureTokenService } from '@bpm/common';
import { SecretClient } from '@azure/keyvault-secrets';

@Injectable()
export class AzureApiService {
  constructor(private readonly azureTokenService: AzureTokenService) {}


  readSecret({ kvName, secretName }: { kvName: string; secretName: string }) {
    //console.log('Token:', this.azureTokenService.getToken());
    const credential = this.azureTokenService.getTokenCredential();
    if (!credential) {
      console.error('Token is not available');
      return null;  
    }
    else {
      return {
        kvName,
        secretName,
        secretValue: `Value-of-${secretName}-from-${kvName}`,
      };
    }  
  }
}
