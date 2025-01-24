import { Router } from 'express'
import { UsersRoutes } from './users/UserRouter';

import { AuthRoutes } from './authtentication/AuthRouter';

import { PacientesRoutes } from './pacientes/PacientesRouter';
import { MedicosRoutes } from './medicos/MedicosRouter';
import { MedicalSpecialitiesRoutes } from './servicios-medicos/MedicalSpecialitiesRoutes';


const router = Router();

// /api
// rutas 

router.use('/auth', AuthRoutes());

router.use('/users', UsersRoutes());

router.use('/pacientes', PacientesRoutes());

router.use('/medicos', MedicosRoutes());

router.use('/medical-services', MedicalSpecialitiesRoutes());



export const AppRoutes = router