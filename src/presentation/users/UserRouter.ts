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
        validateAdmin,
        validateUser,
    } = AuthMiddleware;
    // /api/users
    // Ruta para obtener todos los usuarios


    router.get('/', [validateAdmin], readUsers);
    router.get('/:id', [validateUser], readUserById);


    router.patch('/:id', [validateUser], updateUser);
    router.delete('/:id', [validateAdmin], deleteUser);


    return router;
};
