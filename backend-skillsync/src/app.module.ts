import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    // Configuración de Rate Limiting: Máximo 10 peticiones cada 60 segundos
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10,
    }]),
    AuthModule
  ],
  controllers: [],
  providers: [
    // Guard de forma global para proteger todos los endpoints
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
