-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('PACIENTE', 'MEDICO', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "fecha_nac" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id_paciente" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "obra_social" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id_paciente")
);

-- CreateTable
CREATE TABLE "Medico" (
    "id_medico" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sueldo" DOUBLE PRECISION NOT NULL,
    "especialidadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("id_medico")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" TEXT NOT NULL,
    "codigo_servicio" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paquete" (
    "id" TEXT NOT NULL,
    "codigo_paquete" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio_paquete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paquete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaqueteServicio" (
    "id" SERIAL NOT NULL,
    "paqueteId" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaqueteServicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "fecha_consulta" TIMESTAMP(3) NOT NULL,
    "hora_consulta" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "servicioId" TEXT,
    "paqueteId" TEXT,
    "monto_total" DOUBLE PRECISION NOT NULL,
    "pagado_o_no" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id_turno" TEXT NOT NULL,
    "dia_semana" TEXT NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "hora_fin" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id_turno")
);

-- CreateTable
CREATE TABLE "TurnoReservado" (
    "id_reserva" TEXT NOT NULL,
    "fecha_turno" TIMESTAMP(3) NOT NULL,
    "hora_turno" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "turnoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TurnoReservado_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_userId_key" ON "Paciente"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Medico_userId_key" ON "Medico"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Servicio_codigo_servicio_key" ON "Servicio"("codigo_servicio");

-- CreateIndex
CREATE UNIQUE INDEX "Paquete_codigo_paquete_key" ON "Paquete"("codigo_paquete");

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medico" ADD CONSTRAINT "Medico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medico" ADD CONSTRAINT "Medico_especialidadId_fkey" FOREIGN KEY ("especialidadId") REFERENCES "Servicio"("codigo_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaqueteServicio" ADD CONSTRAINT "PaqueteServicio_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "Paquete"("codigo_paquete") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaqueteServicio" ADD CONSTRAINT "PaqueteServicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("codigo_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id_paciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id_medico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("codigo_servicio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "Paquete"("codigo_paquete") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id_medico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id_medico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id_paciente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoReservado" ADD CONSTRAINT "TurnoReservado_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id_turno") ON DELETE RESTRICT ON UPDATE CASCADE;
