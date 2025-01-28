import prisma from '../../lib/prisma';
import { CustomError } from './custom.error';

export const checkExistPaquete = async (id: string) => {
    if (!id) throw CustomError.badRequest('id or codigo_paquete is required');

    try {
        const existPAquete = await prisma.paquete.findFirst({
            where: {
                OR: [
                    { id },
                    {
                        codigo_paquete: {
                            equals: id,
                            mode: 'insensitive'
                        }
                    },

                ] 
            },
            include: {
                servicios_incluidos: true,
            }
        });

        if (!existPAquete) {
            return {
                ok:false
            }
        }

        return {
            ok: true,
            paquete: existPAquete,
        };

    } catch (error) {
        throw CustomError.internalServer('Error al comprobar si existe paquete');
    }

};