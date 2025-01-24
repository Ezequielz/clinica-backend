import { Request, Response } from 'express';
import { MedicosService } from './medicos.service';
import { medicoDto } from '../../domain/dtos/medico/medico.dto';
import { handleError } from '../helpers/handleError';
import { CustomError } from '../helpers/custom.error';

const createMedico = (req: Request, res: Response) => {

    const body = req.body;


    const [error, medico] = medicoDto.create({ medicoData: body })
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };

    MedicosService.createMedico(medico!)
        .then(resp => {
            if (!resp.medico) throw CustomError.notFound(resp.msg)
            res.status(200).json(resp)
        }
        )
        .catch((error) => handleError(error, res));


};


const readMedicos = (req: Request, res: Response) => {

    MedicosService.readMedicos()
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));

};

const readMedicoById = (req: Request, res: Response) => {

    const { id } = req.params;

    MedicosService.readMedicoById(id)
        .then(resp => {

            if (!resp.medico) throw CustomError.badRequest('Invalid User or Médico Id');
            res.status(200).json(resp);


        })
        .catch((error) => handleError(error, res));

};

const updateMedico = (req: Request, res: Response) => {

    const { id } = req.params;
    const body = req.body;


    const [error, medico] = medicoDto.update({ medicoData: { id, ...body } });
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };

    MedicosService.updateMedico(medico!)
        .then(resp => {

            if (!resp.medico) throw CustomError.notFound('No se encontro médico con ese id')
            res.status(200).json(resp)

        })
        .catch((error) => handleError(error, res));

};


const deleteMedico = (req: Request, res: Response) => {

    const { id } = req.params;

    MedicosService.deleteMedico(id)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};

export const MedicosController = {
    createMedico,
    readMedicos,
    readMedicoById,
    updateMedico,
    deleteMedico,
};