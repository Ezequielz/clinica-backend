import { Router } from 'express';
import { PaypalController } from './PaypalController';


export const PaypalRoutes = (): Router => {
    const router = Router();

    // /api/payments/paypal
    const {
        readPaypal,
        paypalCheckPayment,
        paypalPayment,
        downloadInvoice,
    } = PaypalController;

    router.get('/', readPaypal)    

    router.get("/invoice/:id", downloadInvoice);

    router.post('/check-payment', paypalCheckPayment);
   
    router.post('/', paypalPayment);

    // router.post('/payment', paypalPayment);



    return router;
};