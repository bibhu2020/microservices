import { LoggerMiddleware } from './logger.middleware';

import { ApploggerService } from '@bpm/common/app-logger/applogger.service';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    const mockLogger = {} as ApploggerService;
    expect(new LoggerMiddleware(mockLogger)).toBeDefined();
  });
});
