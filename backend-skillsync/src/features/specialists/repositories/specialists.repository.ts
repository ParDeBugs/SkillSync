import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class SpecialistsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllActive() {
    // TODO: cuando exista la tabla "especialistas" (oficio, galería, tarifa),
    // este método deberá hacer un join en vez de filtrar usuarios directamente.
    return this.prisma.usuarios.findMany({
      where: { rol: 'ESPECIALISTA', activo: true },
    });
  }

  findById(id: number) {
    return this.prisma.usuarios.findFirst({
      where: { id_usuario: id, rol: 'ESPECIALISTA' },
    });
  }

  update(id: number, data: Partial<{ nombre_completo: string }>) {
    return this.prisma.usuarios.update({ where: { id_usuario: id }, data });
  }
}
