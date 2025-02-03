/*
  Warnings:

  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_orderId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_pacienteId_fkey";

-- DropTable
DROP TABLE "orders";

-- CreateTable
CREATE TABLE "OrderModel" (
    "id" TEXT NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "pagadoAt" TIMESTAMP(3),
    "monto_total" DOUBLE PRECISION NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderModel" ADD CONSTRAINT "OrderModel_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id_paciente") ON DELETE CASCADE ON UPDATE CASCADE;
