import prisma from '../../lib/prisma';

import { CustomError } from '../helpers/custom.error';
import { checkExistCodigo_servicio } from '../helpers/checkExistCodigo_servicio';
import { checkExistPaciente } from '../helpers/checkExistPaciente';
import { checkExistPaquete } from '../helpers/checkExistPaquete';
import { checkTurnoAvailableForMedic } from '../helpers/checkTurnoAvailableForMedic';

import { ConsultasPackDTO } from '../../domain/dtos/consulta/consultasPack.dto';
import type { ConsultaUpdateDTO, ConsultaDTO } from '../../domain/dtos/consulta/consulta.dto';
import { checkExistConsulta } from '../helpers/checkExistConsulta';
import { checkServiceOfMedic } from '../helpers/checkServiceOfMedic';

const createConsulta = async (consultaDTO: ConsultaDTO) => {

    const { paquetePrice, ...rest } = consultaDTO;

    const { servicioId, medicoId, fecha_consulta, hora_consulta } = rest;

    const { ok: existServicio, servicio } = await checkExistCodigo_servicio(servicioId!);

    if (!existServicio || !servicio) {
        throw CustomError.badRequest(`codigo de servicio: ${servicioId} inválido, no existente`);
    };

    const medicoForThisService = servicio.medicos.find(medico => consultaDTO.medicoId.includes(medico.id_medico));

    if (!medicoForThisService) {
        throw CustomError.badRequest(`El médico con id: ${consultaDTO.medicoId} no está asociado al servicio ${servicio?.nombre}`);
    };

    const { ok: existPaciente, paciente } = await checkExistPaciente(consultaDTO.pacienteId)
    if (!existPaciente || !paciente) {
        throw CustomError.badRequest(`No se puedo encontrar al paciente con id: ${consultaDTO.pacienteId}`);
    };


    const { ok, msg, turno, fecha } = await checkTurnoAvailableForMedic({ fecha_consulta, hora_consulta, medicoId });
    if (!ok || !turno) {
        throw CustomError.badRequest(msg ?? 'No se puedo corroborar la fecha');
    };

    const fullPrice = paquetePrice ? paquetePrice : servicio.precio;
    const precioWhitDiscount = paciente.obra_social ? fullPrice * 0.85 : fullPrice;

    try {
        const result = await prisma.$transaction(async (tx) => {
     
            const order = await tx.order.create({
                data: {
                    monto_total: 0,
                    pacienteId: consultaDTO.pacienteId
                }
            });


            // Crear consulta
            const consulta = await tx.consulta.create({
                data: {
                    ...rest,
                    medicoId: medicoForThisService.id_medico,
                    fecha_consulta: fecha,
                    orderId: order.id
                }
            });

            // Crear turno reservado
            const turnoReservado = await tx.turnoReservado.create({
                data: {
                    fecha_turno: fecha,
                    hora_turno: hora_consulta,
                    medicoId: medicoForThisService.id_medico,
                    pacienteId: consultaDTO.pacienteId,
                    turnoId: turno.id_turno,
                    consultaId: consulta.id,
                }
            });

            // Actualizar la orden con la consulta y el precio
            await tx.order.update({
                where: { id: order.id },
                data: {
                    consultas: { connect: { id: consulta.id } },
                    monto_total: { increment: precioWhitDiscount }
                }
            });

            return { consulta, turnoReservado };
        });

        return {
            ok: true,
            consulta: result.consulta,
            turnoReservado: result.turnoReservado,
        };
    } catch (error) {
        console.error("Error en la transacción:", error);
        return {
            ok: false,
            error,
        };
    }

};

const createConsultasByPack = async (consultasPackDTO: ConsultasPackDTO) => {
    const { paqueteId, paqueteDetails, ...rest } = consultasPackDTO;

    const { ok: existPaquete, paquete } = await checkExistPaquete(paqueteId!);
    if (!existPaquete) {

        throw CustomError.badRequest(`codigo de paquete: ${paqueteId} inválido, no existente`);
    };

    if (paquete!.servicios_incluidos.length !== paqueteDetails.length) {
        throw CustomError.badRequest(`la canidad de paquetes: ${paqueteDetails.length} no es válida para el paquete ${paqueteId} seleccionado: requiere ${paquete!.servicios_incluidos.length} paquetes`);
    };

    // Validar paciente
    const { ok: existPaciente, paciente } = await checkExistPaciente(consultasPackDTO.pacienteId);
    if (!existPaciente || !paciente) {
        throw CustomError.badRequest(`No se pudo encontrar al paciente con id: ${consultasPackDTO.pacienteId}`);
    };


    return await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                monto_total: 0,
                pacienteId: consultasPackDTO.pacienteId
            }
        });

        const consultasPromises = paqueteDetails.map(async (servicio) => {
            const consultaDTO = {
                ...servicio,
                paqueteId,
                paquetePrice: paquete?.precio_paquete,
                ...rest,
            };

            const { servicioId, medicoId, fecha_consulta, hora_consulta } = consultaDTO;

            // Validar servicio
            const { ok: existServicio, servicio: servicioData } = await checkExistCodigo_servicio(servicioId!);
            if (!existServicio || !servicioData) {
                throw CustomError.badRequest(`Código de servicio: ${servicioId} inválido, no existente`);
            };


            // Verificar médico asociado al servicio
            const medicoForThisService = servicioData.medicos.find((medico) => consultaDTO.medicoId.includes(medico.id_medico));
            if (!medicoForThisService) {
                throw CustomError.badRequest(`El médico con id: ${medicoId} no está asociado al servicio ${servicioData?.nombre}`);
            };

            // Verificar turno disponible
            const { ok, msg, turno, fecha } = await checkTurnoAvailableForMedic({ fecha_consulta, hora_consulta, medicoId });
            if (!ok || !turno) {
                throw CustomError.badRequest(msg ?? 'No se pudo corroborar la fecha');
            };

            // Crear consulta y turno dentro de la transacción
            const consulta = await tx.consulta.create({
                data: {
                    ...servicio,
                    pacienteId: consultasPackDTO.pacienteId,
                    paqueteId,
                    medicoId: medicoForThisService.id_medico,
                    fecha_consulta: fecha,

                    orderId: order.id,
                },
            });

            await tx.turnoReservado.create({
                data: {
                    fecha_turno: fecha,
                    hora_turno: hora_consulta,
                    medicoId: medicoForThisService.id_medico,
                    pacienteId: consultaDTO.pacienteId,
                    turnoId: turno.id_turno,
                    consultaId: consulta.id
                },
            });

            return consulta;
        });

        // Esperar que todas las consultas se completen
        const createdConsultas = await Promise.all(consultasPromises);


        const precioWithDiscount = paciente.obra_social ? paquete!.precio_paquete * 0.80 : paquete!.precio_paquete;

        const orderUpdated= await tx.order.update({
            where: { id: order.id },
            data: {
                consultas: { connect: createdConsultas.map(consulta => ({ id: consulta.id })) },
                monto_total: precioWithDiscount
            }
        });

        return {
            ok: true,
            consultas: createdConsultas,
            order: orderUpdated,
        };
    });

}

const readConsultas = async () => {

    try {
        const consultas = await prisma.consulta.findMany();

        return {
            ok: true,
            consultas
        };

    } catch (error) {
        console.log(error);

        return {
            ok: false,
            msg: 'Error al obtener las consulta'
        };
    }

};

const readConsultaById = async (id: string) => {

    try {

        const consulta = await prisma.consulta.findMany({
            where: {
                OR: [
                    { id },
                    { medicoId: id },
                    { pacienteId: id }
                ]
            },
            include: {
                paquete: {
                    select: {
                        codigo_paquete: true,
                        servicios_incluidos: {
                            select: {
                                servicio: {
                                    select: {
                                        nombre: true
                                    }
                                }
                            }
                        }
                    },
                },
                paciente: {
                    select: {
                        obra_social: true,
                        user: {
                            omit: {
                                password: true,
                                updatedAt: true,
                                createdAt: true,

                            }
                        }

                    }
                }
            }
        });


        if (consulta.length === 0) {
            return {
                ok: false,
                consulta: null
            };
        };

        return {
            ok: true,
            consulta
        };

    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {

            return {
                ok: false,
                consulta: null,
                msg: 'consulta no encontrada',
            };
        };

        return {
            ok: false,
            msg: 'Error al obtener las consultas',
        };
    }

};

const updateConsulta = async (consultaDTO: ConsultaUpdateDTO) => {
    const { id, fecha_consulta, hora_consulta, medicoId } = consultaDTO;

    // Verificar si la consulta existe
    const { ok, consulta } = await checkExistConsulta(id);
    if (!ok || !consulta) {
        throw CustomError.badRequest('No se encontró consulta con ese ID');
    };
    if (medicoId) {
        const { ok } = await checkServiceOfMedic(medicoId, consulta.servicioId!);
        if (!ok)
            throw CustomError.badRequest(`el medico con id ${medicoId}, no esta asociado al servicio ${consulta.servicioId}`);
    };


    try {
        // Convertir la fecha de la consulta a string para la comparación

        let fechaUpdated;
        let medicoUpdated = medicoId && medicoId;
        let horaUpdated = hora_consulta && hora_consulta;

        // Validar que el turno esté disponible para la nueva combinación
        if (medicoId || fecha_consulta || hora_consulta) {
            const [year, month, day] = consulta.fecha_consulta.toISOString().split('T')[0].split('-');
            const storedFecha = `${day}-${month}-${year}`;
            const newFecha = fecha_consulta ? fecha_consulta : storedFecha;
            const newHora = hora_consulta ? hora_consulta : consulta.hora_consulta;
            const newMedico = medicoId ? medicoId : consulta.medicoId;

            const { ok: isTurnoAvailable, msg, turno, fecha } = await checkTurnoAvailableForMedic({
                fecha_consulta: newFecha,
                hora_consulta: newHora,
                medicoId: newMedico,
            });


            if (!isTurnoAvailable || !turno) {
                return {
                    ok: false,
                    updatedConsulta: null,
                    msg
                };
            };

            fechaUpdated = fecha;

        };

        const updatedConsulta = await prisma.consulta.update({
            where: { id },
            data: {
                hora_consulta: horaUpdated,
                fecha_consulta: fechaUpdated,
                medicoId: medicoUpdated,
            },
        });

        return {
            ok: true,
            updatedConsulta,
        };
    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {
            return {
                ok: false,
                updatedConsulta: null,
                msg: 'Consulta no encontrada',
            };
        };

        return {
            ok: false,
            error,
        };
    }
};


const deleteConsulta = async (id: string) => {

    const { ok, consulta } = await checkExistConsulta(id);
    if (!ok || !consulta) {
        throw CustomError.badRequest(`id de consulta: ${id} inválido, no existente`);
    };

    try {
        const deletedConsulta = await prisma.consulta.delete({
            where: {
                id: consulta.id,
            }
        });

        return {
            ok: true,
            consulta: deletedConsulta,
        };

    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {

            return {
                ok: false,
                consulta: null,
                msg: 'consulta no encontrada',
            };
        };
        return {
            ok: false,
            error,
        };
    }
};


export const ConsultasService = {
    // Methods
    createConsulta,
    createConsultasByPack,
    readConsultas,
    readConsultaById,
    updateConsulta,
    deleteConsulta,

};