import prisma from '../../lib/prisma';


export const calculateDiscountedPrice = async (serviciosCodes: string[]) => {
    try {
        const servicios = await prisma.servicio.findMany({
            where: { codigo_servicio: { in: serviciosCodes } },
            select: { precio: true },
        });

        const totalFullPrice = servicios.reduce((sum, servicio) => sum + servicio.precio, 0);

        return {
            ok: true,
            totalPrice: totalFullPrice * 0.85
        };

    } catch (error) {
        console.log(error)

        return {
            ok: false,
            error
        }
    }

};
