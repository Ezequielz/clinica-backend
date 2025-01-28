import { Router } from 'express';
import { PaquetesController } from './PaquetesController';


export const PaquetesRoutes = (): Router => {
    const router = Router();

    const {
        createPaquete,
        readPaquetes,
        readPaquetesByCode,
        updatePaquete,
        deletePaquete,
    } = PaquetesController;

    // /api/paquetes
    // Ruta para obtener todos los paquetes

    router.get('/', readPaquetes);
    router.get('/:code', readPaquetesByCode);
    
    router.post('/', createPaquete);

    router.patch('/:id', updatePaquete);
    router.delete('/:code', deletePaquete);


    return router;
};
