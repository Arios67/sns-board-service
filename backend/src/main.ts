import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // class-validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger
  SwaggerModule.setup(
    '/api-docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('pre-onboard')
        .setDescription('sns-board-service')
        .setVersion('1.0')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'JWT',
            in: 'header',
          },
          'Access Token',
        )
        .build(),
    ),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
