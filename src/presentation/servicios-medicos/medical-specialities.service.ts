import prisma from '../../lib/prisma';
import { checkExistCodigo_servicio } from '../helpers/checkExistCodigo_servicio';
import { CustomError } from '../helpers/custom.error';
import type { MedicalSpecialityUpdateDTO,  MedicalSpecialityDTO } from '../../domain/dtos/servicios-medicos/medical-speciality.dto';



const createMedicalSpeciality = async ( medicalSpecialityDTO: MedicalSpecialityDTO) => {


    const existCode = await checkExistCodigo_servicio(medicalSpecialityDTO.codigo_servicio);
    if (existCode) throw CustomError.badRequest('codigo_servicio inválido, ya existe ese codigo_servicio para otro servicio');

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

const readMedicalSpecialities = async (id?: string) => {

    if (id) {
        const isValidId = await checkExistCodigo_servicio(id);
        if (!isValidId) throw CustomError.notFound('No se encontró ningun servicio con ese id');
    }

    try {
        const servicios = await prisma.servicio.findMany({
            where: {
                codigo_servicio: id
            },
            omit: {
                createdAt: true,
                updatedAt: true
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

}