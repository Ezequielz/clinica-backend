import prisma from '../../lib/prisma';
import { PacienteUpdateDTO } from '../../domain/dtos/paciente/paciente.dto';
import { CustomError } from '../helpers/custom.error';


const readPacientes = async () => {

    try {
        const pacientes = await prisma.user.findMany({
            where: {
                medico: null,
            },
            omit: {
                password: true
            },
            include: {
                paciente: {
                    omit: {
                        userId: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                    
                }
            }
        })

        return {
            ok: true,
            pacientes
        }

    } catch (error) {
        console.log(error)

        return {
            ok: false,
            msg: 'Error al obtener los usuarios'
        }
    }

}
const readPacienteById = async (id: string) => {

    try {
        const paciente = await prisma.paciente.findFirst({
            where: {
                OR: [
                    { userId: id },
                    { id_paciente: id },
                ]
            },
            include: {
                user: {
                    select: {
                        nombre: true,
                        apellido: true,
                        email: true,
                        
                    }
                }
            }
        })

        return {
            ok: true,
            paciente
        }

    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {

            return {
                ok: false,
                paciente: null,
                msg: 'Paciente no encontrado',
            };
        }

        return {
            ok: false,
            msg: 'Error al obtener paciente con ese id'
        }
    }

}

const updatePaciente = async (pacienteUpdateDTO: PacienteUpdateDTO) => {

    const user = await prisma.user.findUnique({ where: { id: pacienteUpdateDTO.userId } });
    if (!user) throw CustomError.badRequest('Invalid User Id');


    try {

        const updatedPaciente = await prisma.paciente.update({
            where: {
                userId: user.id
            },
            data: pacienteUpdateDTO
        });

        return {
            ok: true,
            updatedPaciente
        };

    } catch (error) {
        return {
            ok: false,
            msg: 'Error al modificar paciente'
        };
    };



};


export const PacientesService = {
    // Methods  
    readPacientes,
    readPacienteById,
    updatePaciente,
};