import { Test, TestingModule } from '@nestjs/testing';
import { NorthwindapiController } from './northwindapi.controller';
import { NorthwindapiService } from './northwindapi.service';

describe('NorthwindapiController', () => {
  let northwindapiController: NorthwindapiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NorthwindapiController],
      providers: [NorthwindapiService],
    }).compile();

    northwindapiController = app.get<NorthwindapiController>(
      NorthwindapiController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(northwindapiController.getHello()).toBe('Hello World!');
    });
  });
});
