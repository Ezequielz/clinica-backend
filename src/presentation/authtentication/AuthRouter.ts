import { Router } from 'express';
import { AuthController } from './AuthController';


export const AuthRoutes = (): Router => {
    const router = Router();

    const { loginUser, registerUser } = AuthController;

    // /api/auth
    // rutas 


    /**
 * @swagger
 * tags:
 *  - name: Auth
 *      description: authenticacion y creacion de usuarios
 *  @swagger
* /auth/register:
*   get:
*     tags:
*       - Auth
*     description: login de usuario
*/
    router.post('/register', registerUser);

    /**
* @swagger
* /auth/login:
*   get:
*     tags:
*       - Auth
*     description: login de usuario
*/
    router.post('/login', loginUser);

    return router;
};


