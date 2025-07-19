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
