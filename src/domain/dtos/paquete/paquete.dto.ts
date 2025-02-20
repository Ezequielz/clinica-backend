
interface PaqueteData {
    paqueteData: { [key: string]: any };
};
export interface PaqueteDTO {
    codigo_paquete: string;
    nombre: string;
    serviciosCodes: string[];
    imagen?: string;
};

export interface PaqueteUpdateDTO extends Partial<Omit<PaqueteDTO, "codigo_paquete" | "serviciosCodes">> {
    id: string;
}

const create = ({ paqueteData }: PaqueteData): [string?, PaqueteDTO?] => {

    const { codigo_paquete, nombre, serviciosCodes, imagen } = paqueteData;

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
        imagen,
    }];
    
};

const update = ({ paqueteData }: PaqueteData): [string?, PaqueteUpdateDTO?] => {

    const {  nombre, imagen, id } = paqueteData;

    if (!id) return ['Missing id'];
    return [undefined, {
        id,
        nombre,
        imagen,
    }];
    
};



export const paqueteDto = {
    create,
    update,
};