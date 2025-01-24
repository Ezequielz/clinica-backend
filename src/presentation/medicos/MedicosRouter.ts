import { Router } from 'express';
import { MedicosController } from './MedicosController';



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

    router.get('/', readMedicos);
    router.get('/:id', readMedicoById);

    router.post('/', createMedico);
    router.patch('/:id', updateMedico);
    router.delete('/:id', deleteMedico);



    return router;
};