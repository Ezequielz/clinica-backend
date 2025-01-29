import { Router } from 'express';
import { PaquetesController } from './PaquetesController';
import { AuthMiddleware } from '../middlewares/auth.middleware';


export const PaquetesRoutes = (): Router => {
    const router = Router();

    const {
        createPaquete,
        readPaquetes,
        readPaquetesByCode,
        updatePaquete,
        deletePaquete,
    } = PaquetesController;

    const {
        validateJWT,
        validateAdmin
    } = AuthMiddleware;
    // /api/paquetes
    // Ruta para obtener todos los paquetes

    router.get('/', readPaquetes);
    router.get('/:code', readPaquetesByCode);
    
    router.post('/', [validateJWT, validateAdmin], createPaquete);

    router.patch('/:id', [validateJWT, validateAdmin], updatePaquete);
    router.delete('/:code', [validateJWT, validateAdmin],deletePaquete);


    return router;
};
