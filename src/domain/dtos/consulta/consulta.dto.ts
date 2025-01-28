
interface ConsultaData {
    consultaData: { [key: string]: any };
};
export interface ConsultaDTO {

    fecha_consulta: string;
    hora_consulta: string;
    pacienteId: string;
    medicoId: string;
    servicioId?: string;
    paqueteId?: string;
    paquetePrice?: number;
    pagado?: boolean;
};

export interface ConsultaUpdateDTO extends Partial<ConsultaDTO> {
    id: string;
}

const fechaRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;
const horaRegex = /^\d{2}:\d{2}$/;

const create = ({ consultaData }: ConsultaData): [string?, ConsultaDTO?] => {

    const {
        fecha_consulta,
        hora_consulta,
        pacienteId,
        medicoId,
        servicioId,
        paqueteId,
        paquetePrice,
        pagado,
    } = consultaData;

    if (!servicioId && !paqueteId) return ['Missing servicioId or paqueteId'];
    if (servicioId && paqueteId) return ['solo se puede crear una consulta con 1 servicio o 1 paquete, no ambos'];

    if (!fecha_consulta) return ['Missing fecha_consulta'];  
    if (!fechaRegex.test(fecha_consulta)) {
        return ['La fecha debe tener el formato "DD-MM-YYYY", por ejemplo "20-2-2025"'];
    };

    if (!hora_consulta) return ['Missing hora_consulta'];
   
    if (!horaRegex.test(hora_consulta)) {
        return ['La hora debe tener el formato "HH:mm", por ejemplo "10:00"'];
    };
    if (!pacienteId) return ['Missing pacienteId'];
    if (!medicoId) return ['Missing medicoId'];



    return [undefined, {
        fecha_consulta,
        hora_consulta,
        pacienteId,
        medicoId,
        servicioId,
        paqueteId,
        paquetePrice,
        pagado,
    }];

};

const update = ({ consultaData }: ConsultaData): [string?, ConsultaUpdateDTO?] => {

    const {
        id,
        fecha_consulta,
        hora_consulta,      
        medicoId,
        pagado,
    } = consultaData;

    if (!id) return ['Missing id'];

    return [undefined, {
        id,
        fecha_consulta,
        hora_consulta,      
        medicoId,
        pagado,
    }];

};



export const consultaDto = {
    create,
    update,
};