import prisma from '../../lib/prisma';
import { checkExistCodigo_servicio } from '../helpers/checkExistCodigo_servicio';
import { CustomError } from '../helpers/custom.error';
import type { MedicalSpecialityUpdateDTO,  MedicalSpecialityDTO } from '../../domain/dtos/servicios-medicos/medical-speciality.dto';



const createMedicalSpeciality = async ( medicalSpecialityDTO: MedicalSpecialityDTO) => {


    const {ok, servicio} = await checkExistCodigo_servicio(medicalSpecialityDTO.codigo_servicio);
    if (ok && servicio) throw CustomError.badRequest('codigo_servicio inválido, ya existe ese codigo_servicio para otro servicio');

    try {

        const medicalSpecialityCreated = await prisma.servicio.create({
            data: medicalSpecialityDTO
        });

        return {
            ok: true,
            medicalSpecialityCreated
        };

    } catch (error) {
        return {
            ok: false,
            msg: 'Error al crear servicio médico'
        };
    }

};

const readMedicalSpecialityById = async (id?: string) => {

    if (id) {
        const isValidId = await checkExistCodigo_servicio(id);
        if (!isValidId) throw CustomError.notFound('No se encontró ningun servicio con ese id');
    }

    try {
        const servicio = await prisma.servicio.findFirst({
            where: {
                OR:[
                    {
                      id
                    },
                    {
                        codigo_servicio: id
                    }
                  
                  ]
            },
            include: {
                Consulta: true,
                medicos: {

                  select: {
                    id_medico: true,
                    user: {
                        select: {
                            nombre: true,
                            apellido: true,
                        }
                    },
                    turnos: true
                  }

                 
                }
            },
            omit:{
                updatedAt:true,
                createdAt: true
            }
            
        });

        return {
            ok: true,
            servicio
        };

    } catch (error) {

        console.log(error);
        return {
            ok: false,
            msg: 'Error al obtener los servicios médicos'
        }
    }

}
const readMedicalSpecialities = async () => {


    try {
        const servicios = await prisma.servicio.findMany({
          
            include: {
                Consulta: true,
                medicos: {

                  select: {
                    id_medico: true,
                    user: {
                        select: {
                            nombre: true,
                            apellido: true,
                        }
                    },
                    turnos: true
                  }

                 
                }
            },
            omit:{
                updatedAt:true,
                createdAt: true
            }
            
        });

        return {
            ok: true,
            servicios
        };

    } catch (error) {

        console.log(error);
        return {
            ok: false,
            msg: 'Error al obtener los servicios médicos'
        }
    }

}
const updateMedicalSpeciality = async ( medicalSpecialityDTO: MedicalSpecialityUpdateDTO) => {
    const existSpeciality = await prisma.servicio.findUnique({where: { id: medicalSpecialityDTO.id }});
    if (!existSpeciality) throw CustomError.notFound('No se encotro ningún servicio con ese id');

    try {

        const medicalSpecialityUpdated = await prisma.servicio.update({
            where: {
                id: medicalSpecialityDTO.id
            },
            data: medicalSpecialityDTO
        });
        return {
            ok: true,
            medicalSpecialityUpdated
        };

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            msg: 'Error al crear actualizar el servicio médico'
        };
    }
};
const deleteMedicalSpeciality = async (id: string) => {
    const existSpeciality = await prisma.servicio.findUnique({where: { id }});
    if (!existSpeciality) throw CustomError.notFound('No se encotro ningún servicio con ese id');


    try {
        const medicalSpecialitydeleted = await prisma.servicio.delete({
            where: { id }
        });

        return {
            ok: true,
            medicalSpecialitydeleted
        };
    } catch (error) {
        return {
            ok: false,
            msg: 'Error al eliminar servicio médico'
        };
    }
};


export const MedicalSpecialitiesService = {

    // Methods
    createMedicalSpeciality,
    readMedicalSpecialities,
    updateMedicalSpeciality,
    deleteMedicalSpeciality,
    readMedicalSpecialityById,

}