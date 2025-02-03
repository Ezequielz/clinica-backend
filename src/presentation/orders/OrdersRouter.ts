import { Router } from 'express';
import { OrdersController } from './OrdersController';
import { AuthMiddleware } from '../middlewares/auth.middleware';


export const OrdersRoutes = (): Router => {
    const router = Router();

    // /api/orders
    const {
        readOrders,
        readOrderyId,
        updateOrder,
        deleteOrder,

    } = OrdersController;

    const {
        validateUser,
        validateUserForOrder,
        validateAdmin,
    } = AuthMiddleware;


    router.get('/', [validateAdmin], readOrders);
    router.get('/:id', [validateUser], readOrderyId);

    router.patch('/:id', [validateUserForOrder], updateOrder);
    router.delete('/:id', [validateAdmin], deleteOrder);


    return router;
};