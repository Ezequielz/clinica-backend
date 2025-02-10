import { Request, Response } from 'express';
import { handleError } from '../helpers/handleError';
import { turnosReservadosService } from './turnos-reservados.service';


const readTurnosReservadosByMedic = (req: Request, res: Response) => {
    const { medicoId, fecha, hora } = req.body;

    turnosReservadosService.readTurnosReservadosByMedic( medicoId, fecha, hora)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};



export const turnosReservadosController = {
    readTurnosReservadosByMedic,
};