import { Router } from 'express';
import { turnosReservadosController } from './TurnosReservadosController';


export const TurnosReservadosRoutes = (): Router => {
    const router = Router();

    const {
        readTurnosReservadosByMedic
    } = turnosReservadosController;

    // /api/turnos-reservados
    // rutas 


    router.post('/',  readTurnosReservadosByMedic);


    return router;
};


