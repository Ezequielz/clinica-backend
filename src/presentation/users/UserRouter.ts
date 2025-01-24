import { Router } from 'express';
import { UsersController } from './UsersController';

export const UsersRoutes = (): Router => {
    const router = Router();

    const {
        readUsers,
        readUserById,

        updateUser,
        deleteUser,
    } = UsersController;

    // /api/users
    // Ruta para obtener todos los usuarios

    /**
     * @swagger
     * tags:
     *   - name: Users
     *     description: Operaciones relacionadas con usuarios
     * /users:
     *   get:
     *     tags:
     *       - Users
     *     description: Obtiene la lista de usuarios
     *     responses:
     *       404:
     *         description: Error al obtener lista de usuarios
     *         schema:
     *           type: object
     *           properties:
     *             ok:
     *               type: boolean
     *               example: false
     *             msg:
     *               type: string
     *               example: No se encontraron usuarios
     *       200:
     *         description: Lista de usuarios
     *         schema:
     *           type: object
     *           properties:
     *             ok:
     *               type: boolean
     *               example: true
     *             users:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   nombre:
     *                     type: string
     *                     example: Juan
     *                   apellido:
     *                     type: string
     *                     example: Pérez
     *                   email:
     *                     type: string
     *                     example: juan.perez@example.com
     */
    router.get('/', readUsers);
    router.get('/:id', readUserById);


    router.patch('/:id', updateUser);
    router.delete('/:id', deleteUser);


    return router;
};
