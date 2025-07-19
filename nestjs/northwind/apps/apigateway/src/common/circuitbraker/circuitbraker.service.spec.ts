import { Test, TestingModule } from '@nestjs/testing';
import { CircuitbrakerService } from './circuitbraker.service';

describe('CircuitbrakerService', () => {
  let service: CircuitbrakerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CircuitbrakerService],
    }).compile();

    service = module.get<CircuitbrakerService>(CircuitbrakerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
