import { Router } from 'express';
import { MedicosController } from './MedicosController';
import { AuthMiddleware } from '../middlewares/auth.middleware';



export const MedicosRoutes = (): Router => {
    const router = Router();

    // /api/medicos
    const {
        createMedico,
        readMedicos,
        readMedicoById,
        updateMedico,
        deleteMedico,
    } = MedicosController;

    const {
        validateAdmin
    } = AuthMiddleware;

    router.get('/', readMedicos);
    router.get('/:id', readMedicoById);

    router.post('/', [validateAdmin], createMedico);
    router.patch('/:id', [validateAdmin], updateMedico);
    router.delete('/:id', [validateAdmin], deleteMedico);



    return router;
};