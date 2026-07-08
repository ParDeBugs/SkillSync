import { Module } from '@nestjs/common';
import { SpecialistsController } from './controllers/specialists.controller';
import { SpecialistsService } from './services/specialists.service';
import { SpecialistsRepository } from './repositories/specialists.repository';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SpecialistsController],
  providers: [SpecialistsService, SpecialistsRepository],
})
export class SpecialistsModule {}
