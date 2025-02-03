import { Router } from 'express';
import { OrdersController } from './OrdersController';
import { AuthMiddleware } from '../middlewares/auth.middleware';


export const OrdersRoutes = (): Router => {
    const router = Router();

    // /api/orders
    const {
        readOrders,
        readOrderyId,
        readGanancias,
        updateOrder,
        deleteOrder,

    } = OrdersController;

    const {
        validateUserForOrder,
        validateAdmin,
    } = AuthMiddleware;


    router.get('/', [validateAdmin], readOrders);
    router.post('/ganancias',[ validateAdmin ], readGanancias);
    router.get('/:id', [validateUserForOrder], readOrderyId);

    router.patch('/:id', [validateUserForOrder], updateOrder);
    router.delete('/:id', [validateAdmin], deleteOrder);


    return router;
};