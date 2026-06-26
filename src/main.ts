import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — powers class-validator decorators in DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // throw on unknown properties
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  // Enable CORS so the frontend can call the API
  app.enableCors();

  // Run on port 3002 to avoid any lingering port 3000 conflicts
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
