/*
  Warnings:

  - Added the required column `consultaId` to the `TurnoReservado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TurnoReservado" ADD COLUMN     "consultaId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
