import { Test, TestingModule } from '@nestjs/testing';
import { ApploggerService } from './applogger.service';

describe('ApploggerService', () => {
  let service: ApploggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApploggerService],
    }).compile();

    service = module.get<ApploggerService>(ApploggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
