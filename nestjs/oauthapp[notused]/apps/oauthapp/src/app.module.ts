import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocsModule } from './modules/docs/docs.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserSessionModule } from './modules/user-session/user-session.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [DocsModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally across all modules
      envFilePath: '.env', // Path to your .env file (optional)
    }),
    UserSessionModule,
  ],
})
export class AppModule {}
