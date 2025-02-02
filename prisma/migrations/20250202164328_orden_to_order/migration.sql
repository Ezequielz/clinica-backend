/*
  Warnings:

  - You are about to drop the column `ordenId` on the `Consulta` table. All the data in the column will be lost.
  - You are about to drop the `Orden` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderId` to the `Consulta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_ordenId_fkey";

-- DropForeignKey
ALTER TABLE "Orden" DROP CONSTRAINT "Orden_pacienteId_fkey";

-- AlterTable
ALTER TABLE "Consulta" DROP COLUMN "ordenId",
ADD COLUMN     "orderId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Orden";

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
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id_paciente") ON DELETE CASCADE ON UPDATE CASCADE;
