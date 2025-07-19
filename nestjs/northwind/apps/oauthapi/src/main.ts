import { NestFactory } from '@nestjs/core';
import { OauthapiModule } from './oauthapi.module';

async function bootstrap() {
  const app = await NestFactory.create(OauthapiModule);
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
