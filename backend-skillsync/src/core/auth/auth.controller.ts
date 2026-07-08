import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

const COOKIE_NAME = 'sky_session';
const isProd = process.env.NODE_ENV === 'production';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, usuario } = await this.authService.validarUsuario(
      body.correo_electronico,
      body.contrasena,
    );
    this.setSessionCookie(res, access_token);
    return { usuario }; // el token ya no va en el body
  }

  // ENDPOINT Registro de Clientes
  @Post('register/cliente')
  async registerCliente(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, usuario } = await this.authService.register(
      body,
      'CLIENTE',
    );
    this.setSessionCookie(res, access_token);
    return { usuario };
  }

  // ENDPOINT Registro de Especialistas
  @Post('register/especialista')
  async registerEspecialista(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, usuario } = await this.authService.register(
      body,
      'ESPECIALISTA',
    );
    this.setSessionCookie(res, access_token);
    return { usuario };
  }

  @Post('register/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async registerAdmin(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, usuario } = await this.authService.register(
      body,
      'ADMIN',
    );
    this.setSessionCookie(res, access_token);
    return { usuario };
  }

  // Necesario porque el frontend YA NO puede leer el token (es httpOnly)
  @UseGuards(JwtAuthGuard)
  @Post('me')
  @HttpCode(HttpStatus.OK)
  async me(@Req() req: Request) {
    return { usuario: (req as any).user }; // Passport ya inyecta el payload validado aquí
  }

  private setSessionCookie(res: Response, token: string) {
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
      path: '/',
    });
  }
}
