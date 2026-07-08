import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';

@UseGuards(JwtAuthGuard) // todo endpoint de este controller requiere sesión válida
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Cada usuario consulta SU PROPIO perfil sin exponer IDs ajenos en la URL
  @Get('me')
  getMe(@Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.usersService.getById(userId);
  }

  // Consultar el perfil de OTRO usuario por id: solo ADMIN.
  // Esto es justo la prueba de BOLA de tu rúbrica: /users/105 vs /users/106
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const requester = (req as any).user;
    // BOLA: el id de la URL debe coincidir con el dueño del token, salvo ADMIN
    if (requester.sub !== id && requester.rol !== 'ADMIN') {
      throw new ForbiddenException('No puedes modificar datos de otro usuario');
    }
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  deactivate(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const requester = (req as any).user;
    if (requester.sub !== id && requester.rol !== 'ADMIN') {
      throw new ForbiddenException(
        'No puedes eliminar la cuenta de otro usuario',
      );
    }
    return this.usersService.deactivate(id);
  }
}
