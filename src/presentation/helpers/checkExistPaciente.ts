import prisma from '../../lib/prisma';
import { CustomError } from './custom.error';

export const checkExistPaciente = async (id_paciente: string) => {
    if (!id_paciente) throw CustomError.badRequest('id is required');

    try {
        const existPaciente = await prisma.paciente.findUnique({
            where: {
                id_paciente
            }
        });

        if (!existPaciente) {
            return {
                ok: false
            }
        }

        return {
            ok: true,
            paciente: existPaciente,
        };

    } catch (error) {
        throw CustomError.internalServer('Error al comprobar si existe paciente');
    }

};