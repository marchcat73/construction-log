// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальная валидация
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS для Next.js
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:3007',
      'http://127.0.0.1:3007',
    ],
    credentials: true, // ⚠️ Обязательно для отправки cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  await app.listen(process.env.PORT || 4200);
  console.log(`🚀 Backend running on port ${process.env.PORT}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
