import { Request, Response } from 'express';
import { handleError } from '../helpers/handleError';
import { InfoService } from './info.service';

const readInfo = (req: Request, res: Response) => {

    InfoService.readInfo()
        .then(resp =>   res.status(200).json(resp))
        .catch((error) => handleError(error, res));

};


export const InfoController = {
    readInfo,
};