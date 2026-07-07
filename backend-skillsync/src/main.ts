import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SanitizeInterceptor } from './core/interceptors/sanitize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Añade X-Frame-Options, Content-Security-Policy, y oculta X-Powered-By
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:4000'], // Aquí irán las URLs de tu frontend oficial en Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Activar el escudo de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new SanitizeInterceptor());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
