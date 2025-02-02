
interface OrderData {
    orderData: { [key: string]: any }
};

export interface OrderDTO {
    monto_total: number;
    pacienteId: string;
    transactionId?: string;
};

export interface OrderUpdateDTO {
    id: string;
    pagado?: boolean
    transactionId?: string;
};


const create = ({ orderData }: OrderData): [string?, OrderDTO?] => {

    const { monto_total, pacienteId, transactionId } = orderData;

    if (!monto_total) return ['Missing monto_total'];
    if (!pacienteId) return ['Missing pacienteId'];

    return [undefined, {
        monto_total,
        pacienteId,
        transactionId
    }];

};

const update = ({ orderData }: OrderData): [string?, OrderUpdateDTO?] => {

    const { id, pagado, transactionId } = orderData;

    if (!id) return ['Missing order Id'];

    return [undefined, {
        id,
        pagado,
        transactionId
    }];

};



export const orderDto = {
    create,
    update
};