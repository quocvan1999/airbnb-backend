import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
