import { Request, Response } from 'express';
import { ConsultasService } from './consulta.service';
import { handleError } from '../helpers/handleError';
import { consultaDto } from '../../domain/dtos/consulta/consulta.dto';
import { consultasPackDto } from '../../domain/dtos/consulta/consultasPack.dto';
import { CustomError } from '../helpers/custom.error';
import { gananciasDto } from '../../domain/dtos/consulta/ganancia.dto';

const createConsultasByPack = (req: Request, res: Response) => {

    const { code } = req.params;
    const body = req.body;
    const pacienteId = req.body.user.paciente.id_paciente;
    const [error, consulta] = consultasPackDto.create({
        consultaData: {
            ...body,
            pacienteId,
            paqueteId: code.toUpperCase(),
            servicioId: null
        }
    });
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };

    ConsultasService.createConsultasByPack(consulta!)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};
const createConsulta = (req: Request, res: Response) => {

    const body = req.body;
    const pacienteId = req.body.user.paciente.id_paciente;
    const [error, consulta] = consultaDto.create({
        consultaData: {
            ...body,
            paqueteId: null,
            pacienteId,
        }
    });
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };
    ConsultasService.createConsulta(consulta!)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};
const readConsultas = (req: Request, res: Response) => {
    ConsultasService.readConsultas()
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};
const readConsultaById = (req: Request, res: Response) => {

    const { id } = req.params;
    ConsultasService.readConsultaById(id)
        .then(resp => {
            if (!resp.ok) throw CustomError.badRequest('Invalid ID de Consulta, Medico o Paciente');
            res.status(200).json(resp)


        })
        .catch((error) => handleError(error, res));
};

const readGanancias = (req: Request, res: Response) => {

    const body = req.body;

    const [error, ganancias] = gananciasDto.create({ gananciaData: body });
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };
    ConsultasService.readGanancias(ganancias!)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
}

const updateConsulta = (req: Request, res: Response) => {

    const { id } = req.params;
    const body = req.body
    const [error, consulta] = consultaDto.update({ consultaData: { ...body, id } });
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };
    ConsultasService.updateConsulta(consulta!)
        .then(resp => {
            if (!resp.ok) throw CustomError.badRequest(resp.error ?? resp.msg);
            res.status(200).json(resp)

        })
        .catch((error) => handleError(error, res));
};
const deleteConsulta = (req: Request, res: Response) => {

    const { id } = req.params;

    ConsultasService.deleteConsulta(id)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};


export const ConsultasController = {
    createConsulta,
    createConsultasByPack,
    readConsultas,
    readConsultaById,
    readGanancias,
    updateConsulta,
    deleteConsulta,
};