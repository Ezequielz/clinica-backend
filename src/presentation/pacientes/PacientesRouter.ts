import { Router } from 'express';
import { PacientesController } from './PacientesController';



export const PacientesRoutes = (): Router => {
    const router = Router();

    // /api/pacientes
    const {
        readPacientes,
        readPacienteById,
        updatePaciente,
       
    } = PacientesController;

    
    router.get('/', readPacientes);
    router.get('/:id', readPacienteById);

    router.patch('/:id', updatePaciente);


    return router;
};