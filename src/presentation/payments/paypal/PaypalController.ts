import { Request, Response } from 'express';
import { paymentsService } from './paypal.service';
import { handleError } from '../../helpers/handleError';

const readPaypal = (req: Request, res: Response) => {
    res.json('probando paypal api')
}
const paypalCheckPayment = (req: Request, res: Response) => {
    const { paypalTransactionId } = req.body;

    paymentsService.paypalcheckPayment(paypalTransactionId)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};

const paypalPayment = (req: Request, res: Response) => {
    const { orderId } = req.body; 

    paymentsService.paypalPayment(orderId)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};


export const PaypalController = {
    readPaypal,
    paypalCheckPayment,
    paypalPayment,
};