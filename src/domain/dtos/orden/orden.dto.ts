
interface OrdenData {
    ordenData: { [key: string]: any }
};

export interface OrdenDTO {
    monto_total: number;
    pacienteId: string;
    transactionId?: string;
};

export interface OrdenUpdateDTO {
    id: string;
    pagado?: boolean
    transactionId?: string;
};


const create = ({ ordenData }: OrdenData): [string?, OrdenDTO?] => {

    const { monto_total, pacienteId, transactionId } = ordenData;

    if (!monto_total) return ['Missing monto_total'];
    if (!pacienteId) return ['Missing pacienteId'];

    return [undefined, {
        monto_total,
        pacienteId,
        transactionId
    }];

};

const update = ({ ordenData }: OrdenData): [string?, OrdenUpdateDTO?] => {

    const { id, pagado, transactionId } = ordenData;

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