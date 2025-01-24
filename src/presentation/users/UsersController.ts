import { Request, Response } from 'express';
import { UsersService } from './user.service';
import { handleError } from '../helpers/handleError';
import { CustomError } from '../helpers/custom.error';
import { userDto } from '../../domain/dtos/auth/user.dto';

const readUsers = (req: Request, res: Response) => {
    UsersService.readUsers()
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};

const readUserById = (req: Request, res: Response) => {

    const { id } = req.params;

    UsersService.readUserById(id)
        .then(resp => {
            if (!resp.user) throw CustomError.notFound('No se encontro usario con ese id');
            res.status(200).json(resp);
        })
        .catch((error) => handleError(error, res));

};

const updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body
    const [error, user] = userDto.update({ userData: { id, ...body } });
    if (error) {

        res.status(400).json({ ok: false, error });
        return;
    };


    UsersService.updateUser(user!)
        .then(resp => {

            if (!resp.user) throw CustomError.notFound('No se encontro usario con ese id');
            res.status(200).json(resp);

        })
        .catch((error) => handleError(error, res));
};

const deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;

    const body = req.body
    const [error, user] = userDto.update({ userData: { id, ...body } });
    if (error) {

        res.status(400).json({ ok: false, error });
        return;
    };

    UsersService.deleteUser(user!.id!)
        .then(resp => {

            if (!resp.user) throw CustomError.notFound('No se encontro usario con ese id');
            res.status(200).json(resp);

        })
        .catch((error) => handleError(error, res));
};


export const UsersController = {
    readUsers,
    readUserById,
    updateUser,
    deleteUser,

};