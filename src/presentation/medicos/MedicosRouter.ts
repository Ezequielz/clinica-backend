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
        validateAdmin,
        validateUser,
    } = AuthMiddleware;

    router.get('/', readMedicos);
    router.get('/:id',[validateUser, validateAdmin], readMedicoById);

    router.post('/', [validateAdmin], createMedico);
    router.patch('/:id', [validateUser, validateAdmin], updateMedico);
    router.delete('/:id', [validateAdmin], deleteMedico);



    return router;
};