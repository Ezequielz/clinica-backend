import { Router } from 'express';
import { InfoController } from './InfoController';



export const InfoRoutes = (): Router => {
    const router = Router();

    // /api/info
    const {
        readInfo,
    } = InfoController;

    router.get('/', readInfo);

    return router;
};