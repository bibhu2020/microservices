import { Test, TestingModule } from '@nestjs/testing';
import { ApigatewayController } from './apigateway.controller';
import { ApigatewayService } from './apigateway.service';

describe('ApigatewayController', () => {
  let apigatewayController: ApigatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApigatewayController],
      providers: [ApigatewayService],
    }).compile();

    apigatewayController = app.get<ApigatewayController>(ApigatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(apigatewayController.getHello()).toBe('Hello World!');
    });
  });
});
