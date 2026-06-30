import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '_VHTBijHdZ4WWHAxfXUpXZGiisy53b7QagQHGhFrAodyY133WaLI8NJ1ZccTdLTI1',
      signOptions: { 
        expiresIn: (process.env.JWT_EXPIRATION || '2h' ) as any
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}