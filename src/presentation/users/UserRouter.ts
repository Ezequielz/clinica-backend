import { Router } from 'express';
import { UsersController } from './UsersController';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export const UsersRoutes = (): Router => {
    const router = Router();

    const {
        readUsers,
        readUserById,

        updateUser,
        deleteUser,
    } = UsersController;

    const {
        validateAdmin
    } = AuthMiddleware;
    // /api/users
    // Ruta para obtener todos los usuarios

  
    router.get('/', readUsers);
    router.get('/:id', readUserById);


    router.patch('/:id',updateUser);
    router.delete('/:id', [validateAdmin], deleteUser);


    return router;
};
