import { Router } from 'express'
import { UsersRoutes } from './users/UserRouter';

import { AuthRoutes } from './authtentication/AuthRouter';

import { PacientesRoutes } from './pacientes/PacientesRouter';
import { MedicosRoutes } from './medicos/MedicosRouter';
import { MedicalSpecialitiesRoutes } from './servicios-medicos/MedicalSpecialitiesRoutes';
import { PaquetesRoutes } from './paquetes/PaquetesRouter';
import { ConsultasRoutes } from './consultas/ConsultasRouter';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { OrdersRoutes } from './orders/OrdersRouter';
import { PaymentsRoutes } from './payments/PaymentsRouter';
import { InfoRoutes } from './info/InfoRouter';

const {
    validateJWT,
    validateAdmin,
} = AuthMiddleware;

const router = Router();

// /api
// rutas 

router.use('/auth', AuthRoutes());

router.use('/medical-services', MedicalSpecialitiesRoutes());

router.use('/paquetes', PaquetesRoutes());

router.use('/info', InfoRoutes());

router.use('/users', [validateJWT], UsersRoutes());

router.use('/pacientes', [validateJWT, validateAdmin], PacientesRoutes());

router.use('/medicos', [validateJWT], MedicosRoutes());

router.use('/consultas', [validateJWT], ConsultasRoutes());

router.use('/orders', [validateJWT], OrdersRoutes());

router.use('/payments', PaymentsRoutes());



export const AppRoutes = router