import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { handleError } from '../helpers/handleError';
import { loginUserDto } from '../../domain/dtos/auth/loginUser.dto';
import { userDto } from '../../domain/dtos/auth/user.dto';
import { tokenDto } from '../../domain/dtos/auth/token.dto';

const registerUser = (req: Request, res: Response) => {

    const userData = req.body;

    const [error, user] = userDto.create({ userData });
    if (error) {

        res.status(400).json({ ok: false, error });
        return;
    };


    AuthService.registerUser(user!)
        .then((user) => res.json(user))
        .catch((error) => handleError(error, res));


};


const loginUser = (req: Request, res: Response) => {
    const userData = req.body;

    const [error, user] = loginUserDto.create({ userData });
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };

    AuthService.loginUser(user!)
        .then((user) => {
            res.json(user)
        })
        .catch((error) => {
            console.log({ 'error': error })
            handleError(error, res)
        });

};


const renewToken = async (req: Request, res: Response) => {

    const { user } = req.body

    const tokenData = {
        id: user.id,
        email: user.email
    };
    const [error, token ] = tokenDto.validate({ tokenData });
    // // Generar JWT
    // const token = await generarJWT( uid, name );
    AuthService.renewToken(token!)
    .then((user) => {
        res.json(user)
    })
    .catch((error) => {
        console.log({ 'error': error })
        handleError(error, res)
    });
}

export const AuthController = {
    registerUser,
    loginUser,
    renewToken,
};