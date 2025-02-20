import { Rol } from '@prisma/client';
import prisma from '../../lib/prisma';

const readInfo = async () => {

    try {

        const [serviciosMedicos, pacientes, medicos, paquetes] = await Promise.all([
            prisma.servicio.count(),
            prisma.paciente.count(),
            prisma.medico.count(),
            prisma.paquete.count(),
        ]);


        return {
            ok: true,
            info: {
                serviciosMedicos,
                pacientes,
                medicos,
                paquetes,
            },
        };

    } catch (error: any) {

        return {
            ok: false,
            msg: 'Error al obtener info'
        };
    };
};
const readInfoDashboardAdmin = async () => {
    try {
        const fecha = new Date();
        fecha.setHours(0, 0, 0, 0);
        const [
            serviciosMedicos,
            pacientes,
            medicos,
            paquetes,
            users,
            usersAdmin,
            orders,
            consultas,
            turnosParaHoyDetalles,
        ] = await Promise.all([
            prisma.servicio.count(),
            prisma.paciente.findMany(),
            prisma.medico.findMany({
                include: {
                    user: true,
                    especialidad: true,
                    turnos: {
                        select: {
                            dia_semana: true
                        }
                    }
                }
            }),
            prisma.paquete.count(),
            prisma.user.count(),
            prisma.user.count({ where: { rol: Rol.ADMIN } }),
            prisma.order.findMany(),
            prisma.consulta.count(),
            prisma.turnoReservado.findMany({
                where: { fecha_turno: fecha },
                include: {
                    consulta: {
                        include: { 
                            servicio: true,
                            order: true
                         }
                    },
                    medico: {
                        include: { user: true }
                    },
                    paciente: {
                        include: { user: true }
                    },
                
                }
            }),
        ]);

        const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const today = diasSemana[new Date().getDay()];        
     
        const medicosDisponibles = medicos.filter(medico =>
            medico.turnos.some(turno => turno.dia_semana.toLowerCase() === today)
        );
        


        // Filtrar órdenes pagadas
        const ordersPagadas = orders.filter(o => o.pagado);

        // Filtrar órdenes pagadas hoy
        const ordersPagadasHoy = ordersPagadas.filter(o => {
            if (!o.pagadoAt) return false;
            const fechaPago = new Date(o.pagadoAt);
            fechaPago.setHours(0, 0, 0, 0);
            return fechaPago.getTime() === fecha.getTime();
        });

        return {
            ok: true,
            info: {
                serviciosMedicos: {
                    total: serviciosMedicos
                },
                pacientes: {
                    total: pacientes.length,
                    pacientesConObraSocial: pacientes.filter(p => p.obra_social ).length
                },
                medicos: {
                    total: medicos.length,
                    disponiblesHoy: medicosDisponibles.length,
                    medicos: medicosDisponibles.map(m => ({
                        nombre: m.user.nombre,
                        servicio: m.especialidad.nombre,
                    }))
                },
                paquetes: {
                    total: paquetes
                },
                users: {
                    admin: usersAdmin,
                    users,
                    total: users + usersAdmin,
                },
                orders: {
                    total: orders.length,
                    ordersPagadas: ordersPagadas.length,
                    ordersPagadasHoy: ordersPagadasHoy.length,
                 
                },
                consultas:{
                    total: consultas
                },
                turnosParaHoy: {
                    total: turnosParaHoyDetalles.length,
                    Turnos: turnosParaHoyDetalles.map(t => ({
                        servicio: t.consulta?.servicio?.nombre || "No especificado",
                        medico: t.medico.user.nombre,
                        paciente: t.paciente.user.nombre,
                        horario: t.hora_turno,
                        pagado: t.consulta?.order?.pagado || false
                    }))
                }
            },
        };

    } catch (error: any) {
        return {
            ok: false,
            msg: 'Error al obtener info'
        };
    }
};



export const InfoService = {
    // Methods  
    readInfo,
    readInfoDashboardAdmin,
};