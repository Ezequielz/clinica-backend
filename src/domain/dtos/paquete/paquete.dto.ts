
interface PaqueteData {
    paqueteData: { [key: string]: any };
};
export interface PaqueteDTO {
    codigo_paquete: string;
    nombre: string;
    serviciosCodes: string[]
};

export interface PaqueteUpdateDTO extends Partial<PaqueteDTO> {
    id: string;
}

const create = ({ paqueteData }: PaqueteData): [string?, PaqueteDTO?] => {

    const { codigo_paquete, nombre, serviciosCodes } = paqueteData;

    if (!codigo_paquete) return ['Missing codigo_paquete'];
    if (!nombre) return ['Missing nombre'];
    if (!serviciosCodes) return ['Missing serviciosCodes'];
    if (!Array.isArray(serviciosCodes)) return ['serviciosCodes debe ser un array de codigos de servicio'];
    if (serviciosCodes.length < 2) return ['serviciosCodes debe contener 2 o mas codigos de servicio'];

    const uniqueCodes = new Set(serviciosCodes);
    if (uniqueCodes.size !== serviciosCodes.length) {
        return ['serviciosCodes no debe contener códigos duplicados'];
    }
    
    return [undefined, {
        codigo_paquete,
        nombre,
        serviciosCodes,
    }];
    
};

const update = ({ paqueteData }: PaqueteData): [string?, PaqueteUpdateDTO?] => {

    const { codigo_paquete, nombre,  serviciosCodes, id } = paqueteData;


    if (!id) return ['Missing id'];
    if (serviciosCodes) {
        if (!Array.isArray(serviciosCodes)) return ['serviciosCodes debe ser un array de codigos de servicio'];
        if (serviciosCodes.length < 2) return ['serviciosCodes debe contener 2 o mas codigos de servicio'];
    
        const uniqueCodes = new Set(serviciosCodes);
        if (uniqueCodes.size !== serviciosCodes.length) {
            return ['serviciosCodes no debe contener códigos duplicados'];
        }

    }

    return [undefined, {
        id,
        codigo_paquete,
        nombre,
        serviciosCodes
    }];
    
};



export const paqueteDto = {
    create,
    update,
};