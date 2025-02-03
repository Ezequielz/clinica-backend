import prisma from '../../../lib/prisma';
import { envs } from '../../../config/envs';
import { CustomError } from "../../helpers/custom.error";
import type { PaypalOrderStatusResponse } from './paypal.interface';


const paypalPayment = async (orderId: string) => {
    if (!orderId) {
        throw CustomError.badRequest('Missing orderId');
    };
    try {
        const orderExist = await prisma.order.findFirst({
            where: {
                OR: [{ id: orderId }, { id: { endsWith: orderId } }],
            },
            select: {
                id: true,
                transactionId: true,
                monto_total: true,
            },
        });

        if (!orderExist) {
            throw CustomError.badRequest(`No existe la orden con id: ${orderId}`);
        };
        if (!orderExist.transactionId) {
            throw CustomError.badRequest(`No hay transacciones efectuadas de esta orden: ${orderId}`);
        };
        const authToken = await getPaypalBearerToken();
        if (!authToken) {
            throw CustomError.internalServer('No se pudo obtener token de verificación');
        };

        const resp = await verifyPaypalPayment(orderExist.transactionId, authToken);
        if (!resp) {
            throw CustomError.internalServer('Error al verificar el pago');
        };

        return ({
            ok: true,
            resp,
            orderExist,
        });

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error al obtener orden',
        };
    }
};

const paypalcheckPayment = async (paypalTransactionId: string) => {
    if (!paypalTransactionId) {
        throw CustomError.badRequest('Missing paypalTransactionId');
    };
    const authToken = await getPaypalBearerToken();
    if (!authToken) {
        throw CustomError.internalServer('No se pudo obtener token de verificación');
    };

    const resp = await verifyPaypalPayment(paypalTransactionId, authToken);
    if (!resp) {
        throw CustomError.internalServer('Error al verificar el pago');
    };
    const { status, purchase_units } = resp;

    const { invoice_id: orderId } = purchase_units[0];

    if (status !== "COMPLETED") {
        return {
            ok: false,
            message: "El pago no se completó en PayPal",
        };
    };

    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { pagado: true, pagadoAt: new Date() },
        });

        return {
            ok: true,
            order,
            message: 'Orden actualizada, pagado marcado en true',
        };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'El pago no se realizó',
        };
    }
};

const getPaypalBearerToken = async () => {
    const PAYPAL_CLIENT_ID = envs.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = envs.PAYPAL_CLIENT_SECRET;
    const oauth2Url = envs.PAYPAL_OAUTH_URL ?? '';

    const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

    try {
        const response = await fetch(oauth2Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${base64Token}`,
            },
            body: 'grant_type=client_credentials',
        });
        const result = await response.json();

        return result.access_token || null;
    } catch (error) {
        console.error("Error obteniendo el token de PayPal:", error);
        return null;
    }
};

const verifyPaypalPayment = async (paypalTransactionId: string, bearerToken: string): Promise<PaypalOrderStatusResponse | null> => {
    const paypalOrderUrl = `${envs.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

    try {
        const response = await fetch(paypalOrderUrl, {
            method: 'GET',
            headers: { Authorization: `Bearer ${bearerToken}` },
        });
        return await response.json();
    } catch (error) {
        console.error('Error verificando pago de PayPal:', error);
        return null;
    }
};


export const paymentsService = {
    // Methods  
    paypalPayment,
    paypalcheckPayment,
};