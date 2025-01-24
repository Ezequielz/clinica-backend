import prisma from '../../lib/prisma';
import { CustomError } from './custom.error';

export const checkExistCodigo_servicio= async (codigo_servicio: string) => {
    if (!codigo_servicio) throw CustomError.badRequest('codigo_servicio is required');

    try {
        const isValidEspecialidadId = await prisma.servicio.findUnique({ where: { codigo_servicio} });

        return !!isValidEspecialidadId;

    } catch (error) {
        throw CustomError.badRequest('Error al comprobar especialidadId');
    }

};