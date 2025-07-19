import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController], 
    providers: [UsersService]   //this is the service that will be injected into the controller
})
export class UsersModule {}
