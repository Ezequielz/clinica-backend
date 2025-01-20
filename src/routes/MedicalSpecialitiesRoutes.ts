import { Router } from 'express';
import { MedicalSpecialitiesController } from '../controllers/MedicalSpecialitiesController';





export const MedicalSpecialitiesRoutes = (): Router => {
    const router = Router();

    const { getMedicalSpecialities } = MedicalSpecialitiesController;

    // /api/medical-specialties
    // rutas 
    router.get('/', getMedicalSpecialities);

    return router;
}


