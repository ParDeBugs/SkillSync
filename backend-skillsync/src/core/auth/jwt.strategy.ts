import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

function cookieExtractor(req: Request): string | null {
  return req?.cookies?.['sky_session'] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrae el token de la cookie 'sky_session' en lugar de la cabecera Authorization"
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '_VHTBijHdZ4WWHAxfXUpXZGiisy53b7QagQHGhFrAodyY133WaLI8NJ1ZccTdLTI1',
    });
  }

  async validate(payload: any) {
    // Lo que retornemos aquí se inyectará en la petición
    return payload; // mantén el shape que ya use el resto del código (sub, rol, etc.)
  }
}