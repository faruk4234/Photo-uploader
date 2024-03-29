import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/uploads/photos', express.static('uploads/photos'));
  await app.listen(3001);
}
bootstrap();
