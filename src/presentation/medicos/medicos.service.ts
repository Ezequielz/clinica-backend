import prisma from '../../lib/prisma';

import { checkExistCodigo_servicio } from '../helpers/checkExistCodigo_servicio';
import { CustomError } from '../helpers/custom.error';

import type { MedicoDTO, MedicoUpdateDTO } from '../../domain/dtos/medico/medico.dto';

const createMedico = async (medicoDTO: MedicoDTO) => {

    const { turnos, ...restMedicDto } = medicoDTO

    const { ok } = await checkExistCodigo_servicio(medicoDTO.especialidadId);
    if (!ok) throw CustomError.badRequest('Invalid especialidadId');
    // creacion del medico
    const { medico } = await readMedicoById(medicoDTO.userId);
    if (medico) throw CustomError.badRequest(`el usuario ya está registrado como médico, medico_id: ${medico.id_medico}`);

    try {

        const medico = await prisma.medico.create({
            data: {
                ...restMedicDto,
                ...(turnos && turnos.length > 0 ? {
                    turnos: {
                        create: turnos.map((turno) => ({
                            dia_semana: turno.dia_semana.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
                            hora_inicio: turno.hora_inicio,
                            hora_fin: turno.hora_fin,
                        })),
                    },
                } : {}),
            }
        });

        return {
            ok: true,
            medico
        };

    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2003') {

            return {
                ok: false,
                medico: null,
                msg: 'User id inválido',
            };
        };

        return {
            ok: false,
            msg: 'Error al crear médico'
        };
    };
};


const readMedicos = async () => {

    try {
        const medicos = await prisma.medico.findMany({
            select: {
                id_medico: true,
                especialidad: {
                    select: {
                        codigo_servicio: true,
                        nombre: true
                    }
                },
                turnos: {
                    select: {
                        dia_semana: true,
                        hora_inicio: true,
                        hora_fin: true,
                    }
                }
            }
        });

        return {
            ok: true,
            medicos
        };

    } catch (error) {
        console.log(error);

        return {
            ok: false,
            msg: 'Error al obtener los médicos'
        };
    }

};

const readMedicoById = async (id?: string) => {

    try {
        const medico = await prisma.medico.findFirst({
            where: {
                OR: [
                    { userId: id },
                    { id_medico: id },
                ]
            },
            omit: {
                createdAt: true,
                updatedAt: true
            },
            include: {
                especialidad: {
                    select: {
                        nombre: true,
                        codigo_servicio: true,
                    }
                },
                turnos: {
                    omit: {
                        medicoId: true
                    }
                },
                user: {
                    select: {
                        nombre: true,
                        apellido: true,
                        imagen: true,
                    }
                }
            }

        });
        return {
            ok: true,
            medico
        };

    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {

            return {
                ok: false,
                medico: null,
                msg: 'Usuario o médico no encontrado',
            };
        };


        return {
            ok: false,
            msg: 'Error al buscar médico por id',
        };
    }

};

const updateMedico = async (medicoDTO: MedicoUpdateDTO) => {

    const { id, turnos, ...rest } = medicoDTO;

    const { medico } = await readMedicoById(id);
    if (!medico) throw CustomError.badRequest('No se encontro médico con ese id');

    try {

        if (turnos) {
            const days = turnos.map(t => t.dia_semana);
            for (let i = 0; i < days.length; i++) {
                if (days.indexOf(days[i]) !== i) {
                    return {
                        ok: false,
                        msg: `El día ${days[i]} está repetido`,
                    };
                }
            }

            const turnosMedic = await prisma.turno.findMany({
                where: { medicoId: medico.id_medico },
                select: { id_turno: true, dia_semana: true }
            });

            const turnosAEliminar = turnosMedic
                .filter(t => !turnos.some(nt => nt.id_turno === t.id_turno))
                .map(t => t.id_turno);


            const turnosANuevos = turnos
                .filter(t => !turnosMedic.some(tm => tm.dia_semana === t.dia_semana))
                .map(t => ({
                    dia_semana: t.dia_semana.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
                    hora_inicio: t.hora_inicio,
                    hora_fin: t.hora_fin,
                    medicoId: medico.id_medico
                }));

            if (turnosAEliminar.length > 0) {
                await prisma.turno.deleteMany({
                    where: { id_turno: { in: turnosAEliminar } }
                });
            }


            if (turnosANuevos.length > 0) {
                await prisma.turno.createMany({
                    data: turnosANuevos
                });
            }

        }

        const updatedMedico = await prisma.medico.update({
            where: {
                id_medico: medico.id_medico
            },
            data: rest
        });

        return {
            ok: true,
            medico: updatedMedico
        };

    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {

            return {
                ok: false,
                medico: null,
                msg: 'Usuario o médico no encontrado',
            };
        };


        return {
            ok: false,
            msg: 'Error al actualizar médico',
        };
    }
};

const deleteMedico = async (id: string) => {
    const { medico } = await readMedicoById(id);
    if (!medico) throw CustomError.badRequest(`No existe nigún medico con el id ${id} `);


    try {
        const medicoToDelete = await prisma.medico.delete({
            where: {
                id_medico: medico.id_medico
            }
        });


        return {
            ok: true,
            medico: medicoToDelete
        };

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            msg: 'Error al eliminar médico',
        };
    }

};

export const MedicosService = {
    // Methods  
    createMedico,
    readMedicos,
    readMedicoById,
    updateMedico,
    deleteMedico,
};