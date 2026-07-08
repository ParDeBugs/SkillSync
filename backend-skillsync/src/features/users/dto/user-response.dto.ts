// Único lugar que decide qué campos de "usuarios" son seguros de exponer.
// Mass Assignment / Excessive Data Exposure se previene aquí: whitelist explícita,
// nunca se retorna el objeto crudo de Prisma (que incluye contrasena_hash).
export interface UserPublicView {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  fecha_registro: Date;
}

export function toPublicUser(usuario: any): UserPublicView {
  return {
    id: usuario.id_usuario,
    nombre: usuario.nombre_completo,
    correo: usuario.correo_electronico,
    rol: usuario.rol,
    fecha_registro: usuario.fecha_registro,
  };
}