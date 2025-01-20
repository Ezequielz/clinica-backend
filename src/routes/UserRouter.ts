import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';



export const UsersRoutes = (): Router => {
    const router = Router();

    const { getUsers } = UsersController;


    // /api/users
    // rutas

    router.get('/', getUsers);

    return router;
}


