import { Router } from 'express';
import { PaypalController } from './PaypalController';


export const PaypalRoutes = (): Router => {
    const router = Router();

    // /api/payments/paypal
    const {
        readPaypal,
        paypalCheckPayment,
        paypalPayment,
       
    } = PaypalController;

    router.get('/', readPaypal)    

    router.post('/check-payment', paypalCheckPayment);
   
    router.post('/', paypalPayment);

    // router.post('/payment', paypalPayment);



    return router;
};