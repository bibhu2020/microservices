import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSessionService } from '../user-session/user-session.service';

@Module({
  providers: [AuthService, UserSessionService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
