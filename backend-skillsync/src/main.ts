import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SanitizeInterceptor } from './core/interceptors/sanitize.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());
  // Activar el escudo de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new SanitizeInterceptor());
  app.enableCors({
    origin: process.env.FRONTEND_URL, // debe coincidir EXACTO con el origin del frontend
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
