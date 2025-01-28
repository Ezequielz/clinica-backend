import prisma from '../../lib/prisma';
import { CustomError } from './custom.error';

export const checkExistConsulta = async (id: string) => {
    if (!id) throw CustomError.badRequest('id is required');

    try {
        const existConsulta = await prisma.consulta.findUnique({
            where: {
                id
            }
        });

        if (!existConsulta) {
            return {
                ok: false
            }
        }

        return {
            ok: true,
            consulta: existConsulta,
        };

    } catch (error) {
        throw CustomError.internalServer('Error al comprobar si existe consulta');
    }

};