import prisma from '../../lib/prisma';
import { CustomError } from './custom.error';

export const getPacienteByUserId = async (id: string) => {
    if (!id) throw CustomError.badRequest('id de la consulta es requerida');

    try {
        const paciente = await prisma.user.findUnique({
            where: { id },
            select: {
                paciente: {
                    select: {
                        id_paciente: true,
                        obra_social: true
                    }
                }
            }
        });


        if (!paciente) {
            return {
                ok:false
            }
        }

        return {
            ok: true,
            paciente : paciente.paciente
        };

    } catch (error) {
        throw CustomError.internalServer('Error al obtener paciente');
    }

};