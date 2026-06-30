import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activar el escudo de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina automáticamente cualquier campo "basura" que el frontend envíe y no esté en el DTO
      forbidNonWhitelisted: true, // Lanza un error HTTP 400 si detecta campos no permitidos
      transform: true, // Transforma automáticamente los datos a los tipos de TypeScript esperados
    }),
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
