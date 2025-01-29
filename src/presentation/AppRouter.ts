import { Router } from 'express'
import { UsersRoutes } from './users/UserRouter';

import { AuthRoutes } from './authtentication/AuthRouter';

import { PacientesRoutes } from './pacientes/PacientesRouter';
import { MedicosRoutes } from './medicos/MedicosRouter';
import { MedicalSpecialitiesRoutes } from './servicios-medicos/MedicalSpecialitiesRoutes';
import { PaquetesRoutes } from './paquetes/PaquetesRouter';
import { ConsultasRoutes } from './consultas/ConsultasRouter';
import { AuthMiddleware } from './middlewares/auth.middleware';

const { validateJWT } = AuthMiddleware;

const router = Router();

// /api
// rutas 

router.use('/auth', AuthRoutes());

router.use('/medical-services', MedicalSpecialitiesRoutes());

router.use('/paquetes', PaquetesRoutes());

router.use('/users', [validateJWT], UsersRoutes());

router.use('/pacientes', [validateJWT], PacientesRoutes());

router.use('/medicos', [validateJWT], MedicosRoutes());

router.use('/consultas',[validateJWT], ConsultasRoutes());



export const AppRoutes = router