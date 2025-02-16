import { Router } from 'express';
import { ConsultasController } from './ConsultasController';
import { AuthMiddleware } from '../middlewares/auth.middleware';


export const ConsultasRoutes = (): Router => {
    const router = Router();

    const {
        createConsulta,
        createConsultasByPack,
        readConsultas,
        readConsultaById,
        updateConsulta,
        deleteConsulta,
    } = ConsultasController;

    const {
        validateAdmin,
        validateUserForConsulta,
    } = AuthMiddleware;

    // /api/consultas
    // Ruta para obtener todos los usuarios

    router.get('/',[ validateAdmin ], readConsultas);

    router.get('/:id', readConsultaById);
    
    router.post('/', createConsulta);
    router.post('/:code', createConsultasByPack);

    router.patch('/:id',[ validateAdmin ], updateConsulta);
    router.delete('/:id',[ validateAdmin ], deleteConsulta);

    return router;
};
