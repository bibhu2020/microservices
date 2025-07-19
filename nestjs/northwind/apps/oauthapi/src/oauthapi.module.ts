import { Module } from '@nestjs/common';
import { OauthapiController } from './oauthapi.controller';
import { OauthapiService } from './oauthapi.service';

@Module({
  imports: [],
  controllers: [OauthapiController],
  providers: [OauthapiService],
})
export class OauthapiModule {}
