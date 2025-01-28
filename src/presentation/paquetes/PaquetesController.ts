import { Request, Response } from 'express';
import { PaquetesService } from './paquete.service';
import { handleError } from '../helpers/handleError';
import { CustomError } from '../helpers/custom.error';
import { paqueteDto } from '../../domain/dtos/paquete/paquete.dto';

const createPaquete = (req: Request, res: Response) => {

    const body = req.body;

    const [error, paquete] = paqueteDto.create({ paqueteData: { ...body } });
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };

    PaquetesService.createPaquete(paquete!)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};

const readPaquetes = (req: Request, res: Response) => {
    PaquetesService.readPaquetes()
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};

const readPaquetesByCode = (req: Request, res: Response) => {

    const { code } = req.params;
    PaquetesService.readPaqueteByCode(code)
        .then(resp => {
            if (!resp.paquete) throw CustomError.notFound('No se encontro paquete con ese código')
            res.status(200).json(resp)

        })
        .catch((error) => handleError(error, res));
};


const updatePaquete = (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;

    const [error, paquete] = paqueteDto.update({ paqueteData: { id, ...body } });
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };

    PaquetesService.updatePaquete(paquete!)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};

const deletePaquete = (req: Request, res: Response) => {
    const { code } = req.params;

    if (!code) {
        res.status(400).json({ ok: false, error: 'Missing code' });
    }

    PaquetesService.deletePaquete(code)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};

export const PaquetesController = {
    readPaquetes,
    readPaquetesByCode,
    createPaquete,
    updatePaquete,
    deletePaquete,
};