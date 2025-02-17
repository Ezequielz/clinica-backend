import prisma from '../../lib/prisma';
import { CustomError } from './custom.error';

export const checkExistCodigo_servicio = async (codigo_servicio: string) => {
    if (!codigo_servicio) throw CustomError.badRequest('codigo_servicio is required');

    try {
        const servicio = await prisma.servicio.findFirst({
            where: {
                codigo_servicio: {
                    equals: codigo_servicio,
                    mode: "insensitive",
                },
            },
            include: {
                medicos: {
                    select: {
                        id_medico: true
                    }
                }
            }
        });

       
        if (!servicio) {
            return {
                ok: false,
            };
        }

        return {
            ok: true,
            servicio
        }
    } catch (error) {
        throw CustomError.internalServer('Error al comprobar el codigo de servicio');
    }

};