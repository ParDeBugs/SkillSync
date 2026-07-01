import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.authService.validarUsuario(body.correo_electronico, body.contrasena);
  }

  // ENDPOINT Registro de Clientes
  @Post('register/cliente')
  async registerCliente(@Body() body: RegisterDto) {
    return this.authService.register(body, 'CLIENTE');
  }

  // ENDPOINT Registro de Especialistas
  @Post('register/especialista')
  async registerEspecialista(@Body() body: RegisterDto) {
    return this.authService.register(body, 'ESPECIALISTA');
  }

  @Post('register/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async registerAdmin(@Body() body: RegisterDto) {
    return this.authService.register(body, 'ADMIN');
  }
}