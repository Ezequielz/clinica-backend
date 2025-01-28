import prisma from '../../lib/prisma';

import { checkExistCodigo_servicio } from '../helpers/checkExistCodigo_servicio';
import { CustomError } from '../helpers/custom.error';

import type { MedicoDTO, MedicoUpdateDTO } from '../../domain/dtos/medico/medico.dto';

const createMedico = async (medicoDTO: MedicoDTO) => {

    const {ok} = await checkExistCodigo_servicio(medicoDTO.especialidadId);
    if (!ok) throw CustomError.badRequest('Invalid especialidadId');
    // creacion del medico
    const { medico } = await readMedicoById(medicoDTO.userId);
    if (medico) throw CustomError.badRequest(`el usuario ya está registrado como médico, medico_id: ${medico.id_medico}`);

    try {

        const medico = await prisma.medico.create({
            data: medicoDTO
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
        const medicos = await prisma.medico.findMany();

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
            omit:{
                createdAt: true,
                updatedAt: true
            },
            include: {
                especialidad:{
                    select: {
                        nombre: true
                    }
                },
                turnos: {
                    omit: {
                        medicoId: true
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

    const { id, userId, ...rest } = medicoDTO;

    const { medico } = await readMedicoById(id);
    if (!medico) throw CustomError.badRequest('No se encontro médico con ese id');

    try {

        const updatedMedico = await prisma.medico.update({
            where: {
                id_medico: medico.id_medico
            },
            data: { ...rest }
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
            medico:medicoToDelete
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