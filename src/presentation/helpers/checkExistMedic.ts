import prisma from '../../lib/prisma';
import { CustomError } from './custom.error';

export const checkExistMedic = async (id_medico: string) => {
    if (!id_medico) throw CustomError.badRequest('id_medico is required');

    try {
        const existMedic = await prisma.medico.findUnique({
            where: {
                id_medico
            }
        });

        if (!existMedic) {
            return {
                ok: false
            }
        }

        return {
            ok: true,
            medic: existMedic,
        };

    } catch (error) {
        throw CustomError.internalServer('Error al comprobar si existe médico');
    }

};