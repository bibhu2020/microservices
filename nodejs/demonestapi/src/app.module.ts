import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = new URL(config.get('DATABASE_URL')!);
        return {
          type: 'postgres',
          host: dbUrl.hostname,
          port: Number(dbUrl.port) || 5432,
          username: dbUrl.username,
          password: dbUrl.password,
          database: dbUrl.pathname.slice(1),
          ssl: {
            rejectUnauthorized: false,
          },
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false, // disable in prod!. true will create tables automatically.
        };
      },
    }),
  ],
})
export class AppModule {}