import { Router } from 'express';
import { MedicalSpecialitiesController } from './MedicalSpecialitiesController';


export const MedicalSpecialitiesRoutes = (): Router => {
    const router = Router();

    const { 
        createMedicalSpeciality,
        readMedicalSpecialities,
        updateMedicalSpeciality,
        deleteMedicalSpeciality,
    } = MedicalSpecialitiesController;

    // /api/medical-services
    // rutas 

    router.post('/', createMedicalSpeciality);

    router.get('/', readMedicalSpecialities);
    router.get('/:id', readMedicalSpecialities);

    router.patch('/:id', updateMedicalSpeciality);
    router.delete('/:id', deleteMedicalSpeciality);

    return router;
};


