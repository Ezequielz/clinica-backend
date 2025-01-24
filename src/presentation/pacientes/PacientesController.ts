import { Request, Response } from 'express';
import { PacientesService } from './pacientes.service';
import { type PacienteDTO, pacienteDto } from '../../domain/dtos/paciente/paciente.dto';
import { handleError } from '../helpers/handleError';
import { CustomError } from '../helpers/custom.error';



const readPacientes = (req: Request, res: Response) => {

    PacientesService.readPacientes()
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));

};

const readPacienteById = (req: Request, res: Response) => {

    const { id } = req.params;

    PacientesService.readPacienteById(id)
        .then(resp => {
            
            if (!resp.paciente) throw CustomError.badRequest('No se encontró ningún paciente con esa id');
            res.status(200).json(resp);

        })
        .catch((error) => handleError(error, res));

};

const updatePaciente = (req: Request, res: Response) => {

    const { id } = req.params;
    const body = req.body;

    const [error, paciente] = pacienteDto.update({ pacienteData: { userId: id, ...body  } })
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };

    PacientesService.updatePaciente(paciente!)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));

};


export const PacientesController = {
    readPacientes,
    readPacienteById,
    updatePaciente,
};