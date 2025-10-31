import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { appLogger } from './logger/app-logger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import mongoose from 'mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: appLogger,
    });

    app.useGlobalFilters(new HttpExceptionFilter());

    mongoose.connection.on('error', (error: Error) => {
      appLogger.log({
        level: 'error',
        message: 'MongoDB connection error',
        data: {
          error: error instanceof Error ? error.message : String(error),
        },
      });
    });

    mongoose.connection.on('disconnected', () => {
      appLogger.log({
        level: 'warn',
        message: 'MongoDB disconnected',
      });
    });

    mongoose.connection.on('connected', () => {
      appLogger.log({
        level: 'info',
        message: 'MongoDB connected successfully',
      });
    });

    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());
    // set prefix
    app.setGlobalPrefix('api/v1');
    const corsOrigins =
      process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.length
        ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
        : ['http://localhost:3001', 'http://localhost:3000'];

    app.enableCors({
      origin: corsOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('My App API')
      .setDescription('API documentation for my NestJS app')
      .setVersion('1.0')
      .addBearerAuth()
      .addApiKey(
        {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
        'cookieAuth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document);

    const port = process.env.PORT ?? 3000;
    await app.listen(port, () => {
      appLogger.log({
        level: 'info',
        message: `Application is running on port ${port}`,
      });
    });
  } catch (error) {
    appLogger.log({
      level: 'error',
      message: 'Failed to start application',
      data: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    });
    process.exit(1);
  }
}
void bootstrap();
