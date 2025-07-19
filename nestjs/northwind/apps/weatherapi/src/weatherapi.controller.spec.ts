import { Test, TestingModule } from '@nestjs/testing';
import { WeatherApiController } from './weatherapi.controller';
import { WeatherApiService } from './weatherapi.service';

describe('WeatherapiController', () => {
  let weatherapiController: WeatherApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WeatherApiController],
      providers: [WeatherApiService],
    }).compile();

    weatherapiController = app.get<WeatherApiController>(WeatherApiController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(weatherapiController.getHello()).toBe('Hello World!');
  //   });
  // });
});
