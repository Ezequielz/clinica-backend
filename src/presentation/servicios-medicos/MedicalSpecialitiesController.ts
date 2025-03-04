import { Request, Response } from 'express';

import { handleError } from '../helpers/handleError';
import { MedicalSpecialitiesService } from './medical-specialities.service';
import { medicalSpecialityDto, type MedicalSpecialityUpdateDTO } from '../../domain/dtos/servicios-medicos/medical-speciality.dto';

const createMedicalSpeciality = (req: Request, res: Response) => {

    const body = req.body;

    const [error, medicalSpeciality] = medicalSpecialityDto.create({ medicalSpecialityData: {...body} });
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };
    MedicalSpecialitiesService.createMedicalSpeciality(medicalSpeciality!)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));


};

const readMedicalSpecialities = (req: Request, res: Response) => {
    MedicalSpecialitiesService.readMedicalSpecialities()
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
}
const readMedicalSpecialityById = (req: Request, res: Response) => {
    const { id } = req.params;

    MedicalSpecialitiesService.readMedicalSpecialityById(id)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
}

const updateMedicalSpeciality = (req: Request, res: Response) => {
    const { id } = req.params;
    
    const { nombre, descripcion, precio, imagen } = req.body;

    const updateMedicalSpeciality: MedicalSpecialityUpdateDTO = {
        id,
        nombre,
        descripcion,
        precio,
        imagen,
    };


    const [error, medicalSpeciality] = medicalSpecialityDto.update({ medicalSpecialityData: updateMedicalSpeciality });
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };
  
    MedicalSpecialitiesService.updateMedicalSpeciality(medicalSpeciality!)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};

const deleteMedicalSpeciality = (req: Request, res: Response) => {
    const { id } = req.params;
    MedicalSpecialitiesService.deleteMedicalSpeciality(id)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};


export const MedicalSpecialitiesController = {
    createMedicalSpeciality,
    readMedicalSpecialityById,
    readMedicalSpecialities,
    updateMedicalSpeciality,
    deleteMedicalSpeciality,
};