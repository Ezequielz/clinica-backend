import { Request, Response } from 'express';
import { paymentsService } from './paypal.service';
import { handleError } from '../../helpers/handleError';
import { generatePDF } from '../../helpers/generatePDF';
import { CustomError } from '../../helpers/custom.error';

const readPaypal = (req: Request, res: Response) => {
    res.json('probando paypal api');
};
const downloadInvoice = (req: Request, res: Response) => {
    const { id } = req.params;

    paymentsService.generatePDF(id)
        .then((resp) => {

            if (!resp.ok) throw CustomError.badRequest(resp?.message ?? 'Error al obtener factura');

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=invoice-${id}.pdf`);

            resp.pdf!.pipe(res);

        })
        .catch((error) => handleError(error, res));
};


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
    downloadInvoice,
};