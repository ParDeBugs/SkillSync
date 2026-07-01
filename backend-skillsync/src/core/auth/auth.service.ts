import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { HashingHelper } from '../../shared/helpers/hashing.helper';
import { RegisterDto } from './dto/register.dto';
import { rol_usuario } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

async register(data: RegisterDto, rolAsignado: rol_usuario) {
    const usuarioExistente = await this.prisma.usuarios.findUnique({
      where: { correo_electronico: data.correo_electronico },
    });

    if (usuarioExistente) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const contrasenaEncriptada = await HashingHelper.hashPassword(data.contrasena);

    const nuevoUsuario = await this.prisma.usuarios.create({
      data: {
        nombre_completo: data.nombre_completo,
        correo_electronico: data.correo_electronico,
        contrasena_hash: contrasenaEncriptada,
        rol: rolAsignado,
      },
    });

    return this.generarToken(nuevoUsuario);
  }

  async validarUsuario(correo: string, contrasenaPlana: string) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { correo_electronico: correo },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const esValida = await HashingHelper.comparePasswords(contrasenaPlana, usuario.contrasena_hash);
    if (!esValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return this.generarToken(usuario);
  }

  private generarToken(usuario: any) {
    const payload = { 
      sub: usuario.id_usuario, 
      rol: usuario.rol,
      correo: usuario.correo_electronico 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre_completo,
        rol: usuario.rol
      }
    };
  }
}