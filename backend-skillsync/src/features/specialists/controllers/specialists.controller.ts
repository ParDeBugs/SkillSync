import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { SpecialistsService } from '../services/specialists.service';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

@Controller('specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  // Público: lo consumirá features/search más adelante
  @Get()
  listAll() {
    return this.specialistsService.listAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.specialistsService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const requester = (req as any).user;
    if (requester.sub !== id && requester.rol !== 'ADMIN') {
      throw new ForbiddenException(
        'No puedes modificar el perfil de otro especialista',
      );
    }
    return this.specialistsService.update(id, dto);
  }
}
