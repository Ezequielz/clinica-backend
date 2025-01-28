import prisma from '../../lib/prisma';
import { CustomError } from './custom.error';

export const checkServiceOfMedic = async (medicId: string, codigo_servicio: string) => {
    if (!codigo_servicio) throw CustomError.badRequest('codigo_servicio is required');

    try {
        const medic = await prisma.medico.findFirst({
            where: {
                id_medico: medicId,
                especialidadId: {
                    equals: codigo_servicio,
                    mode: "insensitive",
                },
            },
        });

       
        if (!medic) {
            return {
                ok: false,
            };
        }

        return {
            ok: true,
            medic
        }
    } catch (error) {
        throw CustomError.internalServer('Error al comprobar el médico');
    }

};