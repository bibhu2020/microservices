import { Module, Global } from '@nestjs/common';
import { ApploggerService } from './applogger.service';

@Global()
@Module({
  providers: [ApploggerService],
  exports: [ApploggerService],
})
export class ApploggerModule {}
