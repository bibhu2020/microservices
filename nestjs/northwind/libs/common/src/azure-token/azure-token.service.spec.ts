import { Test, TestingModule } from '@nestjs/testing';
import { AzureTokenService } from './azure-token.service';

describe('AzureTokenService', () => {
  let service: AzureTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureTokenService],
    }).compile();

    service = module.get<AzureTokenService>(AzureTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
