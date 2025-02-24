import prisma from '../../lib/prisma';
import { CustomError } from './custom.error';

export const checkIsDefaultAdminOrUser = async (id: string) => {
    if (!id) throw CustomError.badRequest('id is required');

    try {
        const user = await prisma.user.findUnique({
            where: {
               id
            },
            select: {
                email: true,
            }
        });

        if (!user) {
            return {
                ok:false
            }
        }

        if (user.email !== 'admin@admin.com' && user.email !== 'user@user.com'){
            return {
                ok:false
            }
        }

        return {
            ok: true,
        };

    } catch (error) {
        throw CustomError.internalServer('Error al comprobar defaultUserOrAdmin');
    }

};