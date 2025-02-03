/*
  Warnings:

  - The values [PACIENTE,MEDICO] on the enum `Rol` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `monto_total` on the `Consulta` table. All the data in the column will be lost.
  - You are about to drop the column `pagado_o_no` on the `Consulta` table. All the data in the column will be lost.
  - The primary key for the `PaqueteServicio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `orderId` to the `Consulta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consultaId` to the `TurnoReservado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Rol_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "rol" TYPE "Rol_new" USING ("rol"::text::"Rol_new");
ALTER TYPE "Rol" RENAME TO "Rol_old";
ALTER TYPE "Rol_new" RENAME TO "Rol";
DROP TYPE "Rol_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_medicoId_fkey";

-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_paqueteId_fkey";

-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_servicioId_fkey";

-- DropForeignKey
ALTER TABLE "Medico" DROP CONSTRAINT "Medico_especialidadId_fkey";

-- DropForeignKey
ALTER TABLE "PaqueteServicio" DROP CONSTRAINT "PaqueteServicio_paqueteId_fkey";

-- DropForeignKey
ALTER TABLE "Turno" DROP CONSTRAINT "Turno_medicoId_fkey";

-- DropForeignKey
ALTER TABLE "TurnoReservado" DROP CONSTRAINT "TurnoReservado_medicoId_fkey";

-- DropForeignKey
ALTER TABLE "TurnoReservado" DROP CONSTRAINT "TurnoReservado_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "TurnoReservado" DROP CONSTRAINT "TurnoReservado_turnoId_fkey";

-- AlterTable
ALTER TABLE "Consulta" DROP COLUMN "monto_total",
DROP COLUMN "pagado_o_no",
ADD COLUMN     "orderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Paquete" ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "PaqueteServicio" DROP CONSTRAINT "PaqueteServicio_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PaqueteServicio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PaqueteServicio_id_seq";

-- AlterTable
ALTER TABLE "Servicio" ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "TurnoReservado" ADD COLUMN     "consultaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imagen" TEXT,
ALTER COLUMN "dni" DROP NOT NULL,
ALTER COLUMN "fecha_nac" DROP NOT NULL,
ALTER COLUMN "telefono" DROP NOT NULL,
ALTER COLUMN "direccion" DROP NOT NULL,
ALTER COLUMN "rol" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "pagadoAt" TIMESTAMP(3),
    "monto_total" DOUBLE PRECISION NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Medico" ADD CONSTRAINT "Medico_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Servicio"("codigo_servicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaqueteServicio" ADD CONSTRAINT "PaqueteServicio_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "Paquete"("codigo_paquete") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id_paciente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id_medico") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("codigo_servicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "Paquete"("codigo_paquete") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id_medico") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id_medico") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id_paciente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id_turno") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id_paciente") ON DELETE CASCADE ON UPDATE CASCADE;
