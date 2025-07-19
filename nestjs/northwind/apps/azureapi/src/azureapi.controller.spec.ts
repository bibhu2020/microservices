import { Test, TestingModule } from '@nestjs/testing';
import { AzureapiController } from './azureapi.controller';
import { AzureapiService } from './azureapi.service';

describe('AzureapiController', () => {
  let azureapiController: AzureapiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AzureapiController],
      providers: [AzureapiService],
    }).compile();

    azureapiController = app.get<AzureapiController>(AzureapiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(azureapiController.getHello()).toBe('Hello World!');
    });
  });
});
