import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  // Swagger API documentation at /api/docs
  const config = new DocumentBuilder()
    .setTitle('Squeeze.to API')
    .setDescription(
      'URL shortener API — shorten links, redirect via short codes, and track click stats.',
    )
    .setVersion('1.0')
    .addTag('Links', 'Create, redirect, and track shortened URLs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Run on port 3002 to avoid any lingering port 3000 conflicts
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
