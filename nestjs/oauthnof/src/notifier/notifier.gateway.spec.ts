import { Test, TestingModule } from '@nestjs/testing';
import { NotifierGateway } from './notifier.gateway';

describe('NotifierGateway', () => {
  let gateway: NotifierGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifierGateway],
    }).compile();

    gateway = module.get<NotifierGateway>(NotifierGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
