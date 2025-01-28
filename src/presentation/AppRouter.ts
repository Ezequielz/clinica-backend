import { Router } from 'express'
import { UsersRoutes } from './users/UserRouter';

import { AuthRoutes } from './authtentication/AuthRouter';

import { PacientesRoutes } from './pacientes/PacientesRouter';
import { MedicosRoutes } from './medicos/MedicosRouter';
import { MedicalSpecialitiesRoutes } from './servicios-medicos/MedicalSpecialitiesRoutes';
import { PaquetesRoutes } from './paquetes/PaquetesRouter';
import { ConsultasRoutes } from './consultas/ConsultasRouter';


const router = Router();

// /api
// rutas 

router.use('/auth', AuthRoutes());

router.use('/users', UsersRoutes());

router.use('/pacientes', PacientesRoutes());

router.use('/medicos', MedicosRoutes());

router.use('/medical-services', MedicalSpecialitiesRoutes());

router.use('/paquetes', PaquetesRoutes());

router.use('/consultas', ConsultasRoutes());



export const AppRoutes = router