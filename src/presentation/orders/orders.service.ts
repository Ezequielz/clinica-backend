import prisma from '../../lib/prisma';
import { CustomError } from '../helpers/custom.error';
import type { OrderUpdateDTO } from '../../domain/dtos/order/order.dto';
import { GananciasDTO } from '../../domain/dtos/consulta/ganancia.dto';



// const createOrder = async (ordenDto: OrdenDTO) => {

//     const { ok } = await checkExistPaciente(ordenDto.pacienteId);
//     if (!ok) throw CustomError.badRequest('Invalid pacienteId');

//     try {
//         const orden = await prisma.orden.create({
//             data: ordenDto
//         })

//         return {
//             ok: true,
//             orden
//         }

//     } catch (error) {
//         console.log(error)
//         return {
//             ok: false,
//             orden: null,
//             msg: 'Error al crear la orden'
//         }
//     }
// }
const readOrders = async () => {

    try {
        const orders = await prisma.order.findMany()

        return {
            ok: true,
            orders
        }

    } catch (error) {
        console.log(error)

        return {
            ok: false,
            msg: 'Error al obtener las ordenes'
        }
    }

};
const readOrderById = async (id: string) => {

    try {
        const order = await prisma.order.findUnique({
            where: {
                id
            }
        });

        return {
            ok: true,
            order
        }

    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {

            return {
                ok: false,
                paciente: null,
                msg: 'Orden no encontrada',
            };
        }

        return {
            ok: false,
            msg: 'Error al obtener la orden con ese id'
        }
    }

};
const readGanancias = async (gananciasDTO: GananciasDTO) => {
    const { fecha_inicio, fecha_fin, typo } = gananciasDTO;

    try {
        const where: any = {
            pagado: true,
            consultas: {
                some: {}, // Para poder filtrar dentro de las consultas
            },
        };

        if (fecha_inicio && fecha_fin) {
            where.pagadoAt = {
                gte: new Date(fecha_inicio),
                lte: new Date(fecha_fin),
            };
        } else if (fecha_inicio) {
            const startDate = new Date(fecha_inicio);
            const endDate = new Date(fecha_inicio);
            endDate.setHours(23, 59, 59, 999);

            where.pagadoAt = {
                gte: startDate,
                lte: endDate,
            };
        }

        // Filtrar consultas por tipo
        if (typo === "pack") {
            where.consultas.some.paqueteId = { not: null };
        } else if (typo === "servicio") {
            where.consultas.some.paqueteId = null;
        }

        
        const orders = await prisma.order.findMany({
            where,
            select: {
                monto_total: true,
            },
        });

   
        const totalGanancias = orders.reduce((acc, order) => acc + order.monto_total, 0);

        return {
            ok: true,
            ganancias: totalGanancias,
        };
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            msg: "Error al obtener las ganancias de consultas",
        };
    }
};


const updateOrder = async (orderUpdateDto: OrderUpdateDTO) => {

    const order = await prisma.order.findUnique({ where: { id: orderUpdateDto.id } });
    if (!order) throw CustomError.badRequest('Invalid Order Id');

    let pagadoAt;
    if(orderUpdateDto.pagado) {
        pagadoAt = new Date()
    }

    try {

        const updatedOrder = await prisma.order.update({
            where: {
                id: orderUpdateDto.id
            },
            data: {...orderUpdateDto,
                pagadoAt: pagadoAt
            }
        });

        return {
            ok: true,
            updatedOrder
        };

    } catch (error) {
        return {
            ok: false,
            msg: 'Error al modificar la orden'
        };
    };



};

const deleteOrder = async (id: string) => {
    const { ok } = await readOrderById(id);
    if (!ok) throw CustomError.badRequest('Invalid ordern id');

    try {
        const order = await prisma.order.delete({
            where: {
                id
            }
        });


        return {
            ok: true,
            order
        };

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            order: null,
            msg: 'Error al eliminar orden',
        };
    }
}

export const OrdersService = {
    // Methods  
    // createOrder,
    readOrders,
    readOrderById,
    readGanancias,
    updateOrder,
    deleteOrder,
};