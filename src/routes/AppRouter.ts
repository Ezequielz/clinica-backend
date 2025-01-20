import { Router } from 'express'
import { UsersRoutes } from './UserRouter';
import { MedicalSpecialitiesRoutes } from './MedicalSpecialitiesRoutes';


const router = Router();

// /api
// rutas de la aplicacion 
router.use('/users', UsersRoutes());
router.use('/medical-specialties', MedicalSpecialitiesRoutes());



export const AppRoutes = router