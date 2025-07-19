import { Test, TestingModule } from '@nestjs/testing';
import { NorthwindController } from './northwind.controller';

describe('NorthwindapiController', () => {
  let controller: NorthwindController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NorthwindController],
    }).compile();

    controller = module.get<NorthwindController>(NorthwindController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
