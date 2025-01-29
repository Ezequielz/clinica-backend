import { Router } from 'express';
import { AuthController } from './AuthController';
import { AuthMiddleware } from '../middlewares/auth.middleware';


export const AuthRoutes = (): Router => {
    const router = Router();

    const {
        loginUser,
        registerUser,
        renewToken,
    } = AuthController;

    // /api/auth
    // rutas 

    const {
        validateJWT,
        login,
        register,
    } = AuthMiddleware;

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
    router.post('/register', [register], registerUser);

    /**
* @swagger
* /auth/login:
*   get:
*     tags:
*       - Auth
*     description: login de usuario
*/
    router.post('/login', [login] , loginUser);



    router.get('/renew', [validateJWT], renewToken);

    return router;
};


