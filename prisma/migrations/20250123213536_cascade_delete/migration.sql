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
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id_medico") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id_medico") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id_paciente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id_turno") ON DELETE CASCADE ON UPDATE CASCADE;
