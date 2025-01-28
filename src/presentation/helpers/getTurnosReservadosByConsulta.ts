import prisma from '../../lib/prisma';
import { CustomError } from './custom.error';

export const getTurnosReservadosByConsulta = async (id: string) => {
    if (!id) throw CustomError.badRequest('id de la consulta es requerida');

    try {
        const turnos = await prisma.turnoReservado.findMany({
            where: { consultaId: id },
        });
        if (!turnos) {
            return {
                ok:false
            }
        }

        return {
            ok: true,
            turnos
        };

    } catch (error) {
        throw CustomError.internalServer('Error al comprobar turnos de consulta');
    }

};