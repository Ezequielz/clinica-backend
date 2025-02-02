import prisma from '../../lib/prisma';
import { CustomError } from '../helpers/custom.error';
import type { OrderUpdateDTO } from '../../domain/dtos/order/order.dto';



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

}
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

}

const updateOrder = async (orderUpdateDto: OrderUpdateDTO) => {

    const order = await prisma.order.findUnique({ where: { id: orderUpdateDto.id } });
    if (!order) throw CustomError.badRequest('Invalid Order Id');


    try {

        const updatedOrder = await prisma.order.update({
            where: {
                id: orderUpdateDto.id
            },
            data: orderUpdateDto
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
    updateOrder,
    deleteOrder,
};