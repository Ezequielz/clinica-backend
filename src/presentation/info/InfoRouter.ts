import { Router } from 'express';
import { InfoController } from './InfoController';
import { AuthMiddleware } from '../middlewares/auth.middleware';



export const InfoRoutes = (): Router => {
    const router = Router();

    // /api/info
    const {
        readInfo,
        readInfoDashboardAdmin,
    } = InfoController;

    const { validateJWT, validateAdmin } = AuthMiddleware;

    router.get('/', readInfo);
    router.get('/dashboard', [validateJWT, validateAdmin], readInfoDashboardAdmin);

    return router;
};