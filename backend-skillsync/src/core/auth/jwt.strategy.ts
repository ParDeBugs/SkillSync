import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrae el token del header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '_VHTBijHdZ4WWHAxfXUpXZGiisy53b7QagQHGhFrAodyY133WaLI8NJ1ZccTdLTI1',
    });
  }

  async validate(payload: any) {
    // Lo que retornemos aquí se inyectará en la petición
    return { userId: payload.sub, rol: payload.rol };
  }
}