import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { rol_usuario } from '@prisma/client';

export class RegisterDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  nombre_completo: string;

  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  correo_electronico: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;

  @IsEnum(rol_usuario, { message: 'El rol debe ser estrictamente CLIENTE, ESPECIALISTA o ADMIN' })
  rol: rol_usuario;
}