import { Request, Response } from 'express';
import { handleError } from '../helpers/handleError';
import { CustomError } from '../helpers/custom.error';
import { OrdersService } from './orders.service';
import { orderDto } from '../../domain/dtos/orden/orden.dto';


// const createOrder =  (req: Request, res: Response) => {

//     const body = req.body;
//      const [error, orden] = orderDto.create({ ordenData: body })
//         if (error) {
//             res.status(400).json({ ok: false, error });
//             return;
//         };
    
//         OrdersService.createOrder(orden!)
//             .then(resp => {
//                 if (!resp.orden) throw CustomError.notFound(resp.msg)
//                 res.status(200).json(resp)
//             }
//             )
//             .catch((error) => handleError(error, res));
    
// };

const readOrders = (req: Request, res: Response) => {

    OrdersService.readOrders()
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));

};

const readOrderyId = (req: Request, res: Response) => {

    const { id } = req.params;

    OrdersService.readOrderById(id)
        .then(resp => {

            if (!resp.paciente) throw CustomError.badRequest('No se encontró ninguna orden con esa id');
            res.status(200).json(resp);

        })
        .catch((error) => handleError(error, res));

};

const updateOrder = (req: Request, res: Response) => {

    const { id } = req.params;
    const body = req.body;

    const [error, order] = orderDto.update({ ordenData: { id, ...body } })
    if (error) {
        res.status(400).json({ ok: false, error });
        return;
    };

    OrdersService.updateOrder(order!)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));


};
const deleteOrder = (req: Request, res: Response) => {

    const { id } = req.params;

    OrdersService.deleteOrder(id!)
        .then(resp => res.status(200).json(resp))
        .catch((error) => handleError(error, res));
};


export const OrdersController = {
    // createOrder,
    readOrders,
    readOrderyId,
    updateOrder,
    deleteOrder,
};