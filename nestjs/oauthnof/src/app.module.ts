import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifierGateway } from './notifier/notifier.gateway';
import { NotifierModule } from './notifier/notifier.module';

@Module({
  imports: [NotifierModule],
  controllers: [AppController],
  providers: [AppService, NotifierGateway],
})
export class AppModule {}
