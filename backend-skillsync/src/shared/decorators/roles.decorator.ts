import { SetMetadata } from '@nestjs/common';
import { rol_usuario } from '@prisma/client';

export const ROLES_KEY = 'roles';
// Este decorador recibirá una lista de roles permitidos y los guardará en los metadatos de la ruta
export const Roles = (...roles: rol_usuario[]) => SetMetadata(ROLES_KEY, roles);