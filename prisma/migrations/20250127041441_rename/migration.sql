/*
  Warnings:

  - You are about to drop the column `pagado_o_no` on the `Consulta` table. All the data in the column will be lost.
  - The primary key for the `PaqueteServicio` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Consulta" DROP COLUMN "pagado_o_no",
ADD COLUMN     "pagado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PaqueteServicio" DROP CONSTRAINT "PaqueteServicio_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PaqueteServicio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PaqueteServicio_id_seq";
