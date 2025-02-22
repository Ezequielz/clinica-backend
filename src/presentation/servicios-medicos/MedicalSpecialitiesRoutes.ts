import { Router } from 'express';
import { MedicalSpecialitiesController } from './MedicalSpecialitiesController';
import { AuthMiddleware } from '../middlewares/auth.middleware';


export const MedicalSpecialitiesRoutes = (): Router => {
    const router = Router();

    const { 
        createMedicalSpeciality,
        readMedicalSpecialities,
        readMedicalSpecialityById,
        updateMedicalSpeciality,
        deleteMedicalSpeciality,
    } = MedicalSpecialitiesController;

     const {
            validateJWT,
            validateAdmin
        } = AuthMiddleware;

    // /api/medical-services
    // rutas 

    router.post('/', [validateJWT, validateAdmin], createMedicalSpeciality);

    router.get('/', readMedicalSpecialities);
    router.get('/:id', readMedicalSpecialityById);

    router.patch('/:id', [validateJWT, validateAdmin], updateMedicalSpeciality);
    router.delete('/:id', [validateJWT, validateAdmin], deleteMedicalSpeciality);

    return router;
};


