
interface ConsultaData {
    consultaData: { [key: string]: any };
};
export interface ConsultasPackDTO {
    userId: string;
    paqueteId?: string;
    paqueteDetails: PaqueteDetails[];
};

interface PaqueteDetails {
    servicioId: string;
    medicoId: string;
    fecha_consulta: string;
    hora_consulta: string;
}

const fechaRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;
const horaRegex = /^\d{2}:\d{2}$/;

const create = ({ consultaData }: ConsultaData): [string?, ConsultasPackDTO?] => {

    const {
        userId,
        paqueteId,
        paqueteDetails,
    } = consultaData;

    if (!userId) return ['Missing userId'];
    if (!paqueteDetails) return ['Missing paqueteDetails'];
    if (!Array.isArray(paqueteDetails)) return ['paqueteDetails debe ser un array'];
    if (paqueteDetails.length === 0) return ['paqueteDetails no puede ser un Array vacio'];

    for (const detalle of paqueteDetails) {
        if (!detalle.servicioId) return ['Missing servicioId en paqueteDetails'];
        if (!detalle.medicoId) return ['Missing medicoId en paqueteDetails'];

        if (!detalle.fecha_consulta) return ['Missing fecha_consulta en paqueteDetails'];
        if (!fechaRegex.test(detalle.fecha_consulta)) {
            return ['La fecha debe tener el formato "DD-MM-YYYY", por ejemplo "20-2-2025"'];
        };
        if (!detalle.hora_consulta) return ['Missing hora_consulta en paqueteDetails'];
        
        if (!horaRegex.test(detalle.hora_consulta)) {
            return ['La hora debe tener el formato "HH:mm", por ejemplo "10:00"'];
        }
    }
    return [undefined, {
        userId,
        paqueteId,
        paqueteDetails,

    }];

};


export const consultasPackDto = {
    create,
};