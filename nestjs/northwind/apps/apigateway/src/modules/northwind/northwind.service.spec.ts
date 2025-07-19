import { Test, TestingModule } from '@nestjs/testing';
import { NorthwindService } from './northwind.service';

describe('NorthwindapiService', () => {
  let service: NorthwindService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NorthwindService],
    }).compile();

    service = module.get<NorthwindService>(NorthwindService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
