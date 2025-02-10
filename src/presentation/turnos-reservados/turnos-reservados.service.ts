import prisma from '../../lib/prisma';
import { checkExistMedic } from '../helpers/checkExistMedic';
import { CustomError } from '../helpers/custom.error';


const readTurnosReservadosByMedic = async (medicoId: string, fecha?: string, hora?: string,) => {

    const { ok, medic } = await checkExistMedic(medicoId);
    if (!ok || !medic) {
        throw CustomError.badRequest(`no se encontro ningun medico con el id ${medicoId}`);
    }


    try {
        const turnosReservados = await prisma.turnoReservado.findMany({
            where: {
                medicoId,
                ...(fecha && {
                    fecha_turno: {
                        gte: new Date(`${fecha}T00:00:00.000Z`),
                        lte: new Date(`${fecha}T23:59:59.999Z`)
                    }
                }),
                ...(hora && { hora_turno: hora })
            },
            omit: {
                updatedAt: true,
                createdAt: true
            }

        });

        return {
            ok: true,
            turnosReservados
        };

    } catch (error) {

        console.log(error);
        return {
            ok: false,
            msg: 'Error al obtener los turnos reservados'
        }
    }

}





export const turnosReservadosService = {

    // Methods

    readTurnosReservadosByMedic,


}