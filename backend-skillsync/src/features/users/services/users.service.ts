import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { toPublicUser } from '../dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getById(id: number) {
    const usuario = await this.usersRepository.findById(id);
    if (!usuario || !usuario.activo)
      throw new NotFoundException('Usuario no encontrado');
    return toPublicUser(usuario);
  }

  async update(id: number, dto: UpdateUserDto) {
    const usuario = await this.usersRepository.findById(id);
    if (!usuario || !usuario.activo)
      throw new NotFoundException('Usuario no encontrado');
    const actualizado = await this.usersRepository.update(id, dto);
    return toPublicUser(actualizado);
  }

  async deactivate(id: number) {
    const usuario = await this.usersRepository.findById(id);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    await this.usersRepository.softDelete(id);
    return { ok: true };
  }
}
