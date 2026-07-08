import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: number) {
    return this.prisma.usuarios.findUnique({ where: { id_usuario: id } });
  }

  update(
    id: number,
    data: Partial<{ nombre_completo: string; correo_electronico: string }>,
  ) {
    return this.prisma.usuarios.update({ where: { id_usuario: id }, data });
  }

  softDelete(id: number) {
    // Cumple "Ciclo de Vida y Minimización de Datos" del PDF (Actividad 1):
    // no se borra el registro físicamente, se desactiva.
    return this.prisma.usuarios.update({
      where: { id_usuario: id },
      data: { activo: false },
    });
  }
}
