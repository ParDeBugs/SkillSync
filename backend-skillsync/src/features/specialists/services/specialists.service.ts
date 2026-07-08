import { Injectable, NotFoundException } from '@nestjs/common';
import { SpecialistsRepository } from '../repositories/specialists.repository';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { toPublicUser } from '../../users/dto/user-response.dto';

@Injectable()
export class SpecialistsService {
  constructor(private readonly specialistsRepository: SpecialistsRepository) {}

  async listAll() {
    const especialistas = await this.specialistsRepository.findAllActive();
    return especialistas.map(toPublicUser); // lista pública, mismo filtro de campos
  }

  async getById(id: number) {
    const especialista = await this.specialistsRepository.findById(id);
    if (!especialista)
      throw new NotFoundException('Especialista no encontrado');
    return toPublicUser(especialista);
  }

  async update(id: number, dto: UpdateUserDto) {
    const especialista = await this.specialistsRepository.findById(id);
    if (!especialista)
      throw new NotFoundException('Especialista no encontrado');
    const actualizado = await this.specialistsRepository.update(id, {
      nombre_completo: dto.nombre_completo,
    });
    return toPublicUser(actualizado);
  }
}
