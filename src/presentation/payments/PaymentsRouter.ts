import { Router } from 'express';
import { PaypalRoutes } from './paypal/PaypalRouter';




export const PaymentsRoutes = (): Router => {
    const router = Router();

    // /api/payments
    
    router.use('/paypal', PaypalRoutes());



    return router;
};