/*
  Warnings:

  - You are about to drop the column `monto_total` on the `Consulta` table. All the data in the column will be lost.
  - You are about to drop the column `pagado` on the `Consulta` table. All the data in the column will be lost.
  - Added the required column `ordenId` to the `Consulta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consulta" DROP COLUMN "monto_total",
DROP COLUMN "pagado",
ADD COLUMN     "ordenId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Paquete" ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "Servicio" ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imagen" TEXT;

-- CreateTable
CREATE TABLE "Orden" (
    "id" TEXT NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "monto_total" DOUBLE PRECISION NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orden_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id_paciente") ON DELETE CASCADE ON UPDATE CASCADE;
