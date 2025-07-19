import { Test, TestingModule } from '@nestjs/testing';
import { ShipperController } from './shipper.controller';
import { ShipperService } from './shipper.service';

describe('ShipperController', () => {
  let controller: ShipperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipperController],
      providers: [ShipperService],
    }).compile();

    controller = module.get<ShipperController>(ShipperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
