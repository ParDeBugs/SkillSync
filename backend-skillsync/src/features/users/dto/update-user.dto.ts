import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre_completo?: string;

  @IsOptional()
  @IsEmail()
  correo_electronico?: string;

  // "rol" y "contrasena_hash" se excluyen deliberadamente de este DTO.
  // Con ValidationPipe({ forbidNonWhitelisted: true }) ya activo globalmente,
  // cualquier intento de mandarlos regresa 400 automáticamente.
}