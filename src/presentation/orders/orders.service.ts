import prisma from '../../lib/prisma';
import { CustomError } from '../helpers/custom.error';
import type { OrderUpdateDTO } from '../../domain/dtos/order/order.dto';
import { GananciasDTO } from '../../domain/dtos/order/ganancia.dto';



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
            },
            include: {
                consultas: {
                    include: {
                        medico: {
                            select: {
                                user: {
                                    select: {
                                        nombre: true,
                                        apellido: true,
                                    }
                                }
                            },

                        },
                        servicio: {
                            select: {
                                nombre: true,
                                codigo_servicio: true,
                                precio: true,

                            }
                        },
                        paquete: {
                            select: {
                                nombre: true,
                                precio_paquete: true,
                                codigo_paquete: true,
                            }
                        }

                    }
                },


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

const readGananciasOld = async (gananciasDTO: GananciasDTO) => {
    const { month, year, typo } = gananciasDTO;

    try {
        const now = new Date();
        const mesActual = now.getMonth();
        const anioActual = now.getFullYear();
        const mesSeleccionado = month ? parseInt(month) : mesActual;
        const anioSeleccionado = year ?? anioActual;

        // Validar si el mes y año seleccionados son futuros
        if (anioSeleccionado > anioActual || (anioSeleccionado === anioActual && mesSeleccionado > mesActual)) {
            return { ok: false, msg: "No se pueden obtener ganancias de un mes futuro" };
        }

        const fechaInicioMes = new Date(anioSeleccionado, mesSeleccionado, 1);
        const fechaFinMes = new Date(anioSeleccionado, mesSeleccionado + 1, 0);

        const where: any = {
            pagado: true,
            consultas: { some: {} },
            pagadoAt: { gte: fechaInicioMes, lte: fechaFinMes },
        };

        if (typo === "pack") {
            where.consultas.some.paqueteId = { not: null };
        } else if (typo === "servicio") {
            where.consultas.some.paqueteId = null;
        }

        where.pagadoAt = { gte: fechaInicioMes, lte: fechaFinMes };

        const orders = await prisma.order.findMany({
            where,
            select: { monto_total: true, pagadoAt: true },
        });

        const totalGananciasHoy = orders
            .filter((order) => order.pagadoAt && order.pagadoAt.toDateString() === now.toDateString())
            .reduce((acc, order) => acc + order.monto_total, 0);

        const semanas = obtenerSemanasDelMes(mesSeleccionado, anioSeleccionado).map(() => ({
            lunes: 0, martes: 0, miércoles: 0, jueves: 0, viernes: 0
        }));

        orders.forEach((order) => {
            if (!order.pagadoAt || !(order.pagadoAt instanceof Date)) return;

            const diaSemana = order.pagadoAt.getDay();
            if (diaSemana === 0 || diaSemana === 6) return; // Ignorar sábados y domingos

            // Mapeo de días de la semana a los nombres esperados en el objeto
            const diasValidos: Record<string, keyof typeof semanas[0]> = {
                "lunes": "lunes",
                "martes": "martes",
                "miércoles": "miércoles",
                "jueves": "jueves",
                "viernes": "viernes"
            };

            const nombreDia = order.pagadoAt.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
            const semanaIndex = Math.floor((order.pagadoAt.getDate() - 1) / 7);

            const diaKey = diasValidos[nombreDia]; // Convertimos el nombre del día a la clave válida

            // Verifica que la semana existe y que el día es válido
            if (!semanas[semanaIndex] || !diaKey) return;

            semanas[semanaIndex][diaKey] += order.monto_total;
        });



        const semanasFiltradas = mesSeleccionado === mesActual ? semanas.slice(0, Math.ceil(now.getDate() / 7)) : semanas;
        return {
            ok: true,
            ganancias: {
                today: totalGananciasHoy,
                monthSelected: mesSeleccionado.toString(),
                weeks: semanasFiltradas,
            },
        };
    } catch (error) {
        console.error(error);
        return { ok: false, msg: "Error al obtener las ganancias de consultas" };
    }
};
const readGanancias = async (gananciasDTO: GananciasDTO) => {
    const { month, year, typo } = gananciasDTO;

    try {
        const now = new Date();
        const mesActual = now.getMonth();
        const anioActual = now.getFullYear();
        const mesSeleccionado = month ? parseInt(month) : mesActual;
        const anioSeleccionado = year ?? anioActual;

        if (anioSeleccionado > anioActual || (anioSeleccionado === anioActual && mesSeleccionado > mesActual)) {
            return { ok: false, msg: "No se pueden obtener ganancias de un mes futuro" };
        }

        const fechaInicioMes = new Date(anioSeleccionado, mesSeleccionado, 1);
        const fechaFinMes = new Date(anioSeleccionado, mesSeleccionado + 1, 0);

        const where: any = {
            pagado: true,
            consultas: { some: {} },
            pagadoAt: { gte: fechaInicioMes, lte: fechaFinMes },
        };

        if (typo === "pack") {
            where.consultas.some.paqueteId = { not: null };
        } else if (typo === "servicio") {
            where.consultas.some.paqueteId = null;
        }

        const orders = await prisma.order.findMany({
            where,
            select: { monto_total: true, pagadoAt: true },
        });

        const totalGananciasHoy = orders
            .filter((order) => order.pagadoAt && order.pagadoAt.toDateString() === now.toDateString())
            .reduce((acc, order) => acc + order.monto_total, 0);

        // Crear objeto con todos los días hábiles del mes con valores en 0
        const gananciasPorDia: Record<string, number> = {};
        for (let dia = 1; dia <= fechaFinMes.getDate(); dia++) {
            const fecha = new Date(anioSeleccionado, mesSeleccionado, dia);
            const diaSemana = fecha.getDay();
            if (diaSemana !== 0 && diaSemana !== 6) { // lunes a viernes
                const nombreDia = fecha.toLocaleDateString("es-ES", { weekday: "long" });
                const clave = `${nombreDia} ${dia}`;
                gananciasPorDia[clave] = 0;
            }
        }

        // Sumar ganancias en los días correspondientes
        orders.forEach((order) => {
            if (!order.pagadoAt || !(order.pagadoAt instanceof Date)) return;

            const diaSemana = order.pagadoAt.getDay();
            if (diaSemana === 0 || diaSemana === 6) return; // Ignorar sábados y domingos

            const nombreDia = order.pagadoAt.toLocaleDateString("es-ES", { weekday: "long" });
            const numeroDia = order.pagadoAt.getDate();
            const clave = `${nombreDia} ${numeroDia}`;

            gananciasPorDia[clave] += order.monto_total;
        });

        // Convertir a array y ordenar por número de día
        const gananciasOrdenadas = Object.entries(gananciasPorDia)
            .sort(([a], [b]) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]))
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        const totalGanancias = Object.values(gananciasOrdenadas as Record<string, number>)
            .reduce((acc, value) => acc + value, 0);


        return {
            ok: true,
            ganancias: {
                today: totalGananciasHoy,
                monthSelected: mesSeleccionado.toString(),
                month: gananciasOrdenadas,
                totalGanancias,
            },
        };
    } catch (error) {
        console.error(error);
        return { ok: false, msg: "Error al obtener las ganancias de consultas" };
    }
};

const updateOrder = async (orderUpdateDto: OrderUpdateDTO) => {

    const order = await prisma.order.findUnique({ where: { id: orderUpdateDto.id } });
    if (!order) throw CustomError.badRequest('Invalid Order Id');

    let pagadoAt: Date | null = null;
    if (orderUpdateDto.pagado) {
        pagadoAt = new Date();
    }

    try {

        const updatedOrder = await prisma.order.update({
            where: {
                id: orderUpdateDto.id
            },
            data: {
                ...orderUpdateDto,
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


const obtenerSemanasDelMes = (mes: number, anio: number) => {
    const semanas: Record<string, number>[] = [];
    const firstDay = new Date(anio, mes, 1);
    const lastDay = new Date(anio, mes + 1, 0);

    let currentWeek: Record<string, number> = {};
    let currentDay = new Date(firstDay);

    while (currentDay <= lastDay) {
        const nombreDia = currentDay.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();

        if (!currentWeek[nombreDia]) {
            currentWeek[nombreDia] = 0;
        }

        if (currentDay.getDay() === 0) {
            semanas.push(currentWeek);
            currentWeek = {};
        }

        currentDay.setDate(currentDay.getDate() + 1);
    }

    if (Object.keys(currentWeek).length > 0) {
        semanas.push(currentWeek);
    }

    return semanas;
};

export const OrdersService = {
    // Methods  
    // createOrder,
    readOrders,
    readOrderById,
    readGanancias,
    updateOrder,
    deleteOrder,
};