-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('CLIENTE', 'ESPECIALISTA', 'ADMIN');

-- CreateEnum
CREATE TYPE "tipo_validacion_ia" AS ENUM ('OCR_DOCUMENTO', 'LLM_EXAMEN', 'VISION_PORTAFOLIO', 'BIOMETRIA_FACIAL');

-- CreateTable
CREATE TABLE "bitacora_auditoria" (
    "id_bitacora" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "accion" VARCHAR(255) NOT NULL,
    "ruta_endpoint" VARCHAR(255),
    "fecha_accion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "detalles" TEXT,

    CONSTRAINT "bitacora_auditoria_pkey" PRIMARY KEY ("id_bitacora")
);

-- CreateTable
CREATE TABLE "categorias_oficios" (
    "id_categoria" SERIAL NOT NULL,
    "nombre_oficio" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "categorias_oficios_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "perfiles_especialistas" (
    "id_perfil" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "id_categoria" INTEGER,
    "telefono" VARCHAR(20),
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "foto_perfil_base64" TEXT,
    "foto_identificacion_base64" TEXT,
    "tarifa_visita" DECIMAL(10,2),
    "perfil_verificado" BOOLEAN DEFAULT false,

    CONSTRAINT "perfiles_especialistas_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "portafolios" (
    "id_portafolio" SERIAL NOT NULL,
    "id_perfil" INTEGER,
    "titulo_trabajo" VARCHAR(150),
    "descripcion" TEXT,
    "imagen_base64" TEXT NOT NULL,
    "fecha_subida" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portafolios_pkey" PRIMARY KEY ("id_portafolio")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "correo_electronico" VARCHAR(150) NOT NULL,
    "contrasena_hash" VARCHAR(255) NOT NULL,
    "rol" "rol_usuario" NOT NULL,
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "validaciones_ia" (
    "id_validacion" SERIAL NOT NULL,
    "id_perfil" INTEGER,
    "tipo_validacion" "tipo_validacion_ia" NOT NULL,
    "resultado_json" JSONB NOT NULL,
    "aprobado" BOOLEAN NOT NULL,
    "fecha_validacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validaciones_ia_pkey" PRIMARY KEY ("id_validacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_oficios_nombre_oficio_key" ON "categorias_oficios"("nombre_oficio");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_electronico_key" ON "usuarios"("correo_electronico");

-- AddForeignKey
ALTER TABLE "bitacora_auditoria" ADD CONSTRAINT "bitacora_auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfiles_especialistas" ADD CONSTRAINT "perfiles_especialistas_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias_oficios"("id_categoria") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfiles_especialistas" ADD CONSTRAINT "perfiles_especialistas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "portafolios" ADD CONSTRAINT "portafolios_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "perfiles_especialistas"("id_perfil") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "validaciones_ia" ADD CONSTRAINT "validaciones_ia_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "perfiles_especialistas"("id_perfil") ON DELETE CASCADE ON UPDATE NO ACTION;
