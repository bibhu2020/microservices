import { Test, TestingModule } from '@nestjs/testing';
import { OauthapiController } from './oauthapi.controller';
import { OauthapiService } from './oauthapi.service';

describe('OauthapiController', () => {
  let oauthapiController: OauthapiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OauthapiController],
      providers: [OauthapiService],
    }).compile();

    oauthapiController = app.get<OauthapiController>(OauthapiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oauthapiController.getHello()).toBe('Hello World!');
    });
  });
});
