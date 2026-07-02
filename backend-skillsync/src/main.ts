import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  // Activar el escudo de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina automáticamente cualquier campo "basura" que el frontend envíe y no esté en el DTO
      forbidNonWhitelisted: true, // Lanza un error HTTP 400 si detecta campos no permitidos
      transform: true, // Transforma automáticamente los datos a los tipos de TypeScript esperados
    }),
  );
  app.enableCors({
    origin: process.env.FRONTEND_URL, // debe coincidir EXACTO con el origin del frontend
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
