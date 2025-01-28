import prisma from '../../lib/prisma';
import { checkIsValidDate } from './checkIsValidDate';
import { CustomError } from './custom.error';

interface Props {
    fecha_consulta: string;
    hora_consulta: string;
    medicoId: string;
}
export const checkTurnoAvailableForMedic = async ({ fecha_consulta, hora_consulta, medicoId }: Props) => {

    const isValid = checkIsValidDate(fecha_consulta);
    if (!isValid) {
        return {
            ok: false,
            msg: 'fecha inválida'
        }
    }

    // Validar disponibilidad del médico
    const [day, month, year] = fecha_consulta.split('-').map(Number);
    const fechaConsultaDate = new Date(year, month - 1, day); // Meses en JavaScript van de 0 a 11
    const diaConsulta = fechaConsultaDate.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();

    try {

        const turnosDelMedico = await prisma.turno.findMany({
            where: {
                medicoId,
                dia_semana: {
                    equals: diaConsulta,
                    mode: 'insensitive'
                },
                
            },
        });

        if (!turnosDelMedico.length) {
            //  throw CustomError.badRequest(`El médico no tiene turnos disponibles el día ${diaConsulta}.`);
            return {
                ok: false,
                msg: `El médico ${medicoId} no tiene turnos disponibles el día ${diaConsulta}.`
            }
        }

        const turnoValido = turnosDelMedico.find(turno => {
            const [horaInicio, minutoInicio] = turno.hora_inicio.split(':').map(Number);
            const [horaFin, minutoFin] = turno.hora_fin.split(':').map(Number);
            const [horaConsulta, minutoConsulta] = hora_consulta.split(':').map(Number);

            const inicio = horaInicio * 60 + minutoInicio;
            const fin = horaFin * 60 + minutoFin;
            const consulta = horaConsulta * 60 + minutoConsulta;

            return consulta >= inicio && consulta <= fin;
        });



        if (!turnoValido) {
            const horariosDisponibles = turnosDelMedico
                .map(turno => `${turno.dia_semana} de ${turno.hora_inicio} a ${turno.hora_fin}`)
                .join(', ');

            return {
                ok: false,
                msg: `El médico ${medicoId} no está disponible en la fecha y hora seleccionada. Horarios disponibles: ${horariosDisponibles}.`
            }
        }

        const [horaConsulta, minutoConsulta] = hora_consulta.split(':').map(Number);
        const inicioConsultaMinutos = horaConsulta * 60 + minutoConsulta;
        const finConsultaMinutos = inicioConsultaMinutos + 30;

        const turnosReservados = await prisma.turnoReservado.findMany({
            where: {
                medicoId,
                fecha_turno: {
                    equals: fechaConsultaDate,
                },
             
            },
        });
    
        const conflictos = turnosReservados.filter(turno => {
            const [horaReservada, minutoReservado] = turno.hora_turno.split(':').map(Number);
            const reservadaEnMinutos = horaReservada * 60 + minutoReservado;
        
            return (
                reservadaEnMinutos >= inicioConsultaMinutos &&
                reservadaEnMinutos < finConsultaMinutos
            );
        });

        if (conflictos.length >= 2) {
            return {
                ok: false,
                msg: `El médico ya tiene el máximo de turnos reservados para la hora ${hora_consulta}. Próximo horario disponible: ...`
            };
        }

        return {
            ok: true,
            turno: turnosDelMedico.at(0),
            fecha: fechaConsultaDate
        }

    } catch (error) {
        console.log(error)
        throw CustomError.internalServer('Error al comprobar turnos del médico');
    }




}
