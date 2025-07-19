import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { EmployeesModule } from './employees/employees.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerModule } from './my-logger/my-logger.module';


@Module({
  imports: [UsersModule, DbModule, EmployeesModule, MyLoggerModule
    , ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,   // 3 requests per 1 seconds (short limit)
      limit: 3,
    },{
      name: 'long',
      ttl: 60000,   // 100 requests per 1 minute (long limit)
      limit: 100,
    }]), MyLoggerModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
