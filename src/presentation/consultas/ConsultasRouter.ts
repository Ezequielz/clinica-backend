import { Router } from 'express';
import { ConsultasController } from './ConsultasController';


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

    // /api/consultas
    // Ruta para obtener todos los usuarios

    router.get('/', readConsultas);

    router.get('/:id', readConsultaById);
    
    router.post('/', createConsulta);
    router.post('/:code', createConsultasByPack);

    router.patch('/:id', updateConsulta);
    router.delete('/:id', deleteConsulta);

    return router;
};
