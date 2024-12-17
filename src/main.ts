import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  const configSwagger = new DocumentBuilder()
    .setTitle('Api airbnb')
    .setDescription('Danh sách Api Airbnb')
    .setVersion('1.0')
    .build();

  const swagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('swagger', app, swagger);

  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
