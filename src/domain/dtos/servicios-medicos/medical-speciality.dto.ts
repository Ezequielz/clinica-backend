
interface MedicalSpecialityData {
    medicalSpecialityData: { [key: string]: any }
};

export interface MedicalSpecialityDTO {
    codigo_servicio: string;
    nombre: string;
    descripcion: string;
    precio: number;
};

export interface MedicalSpecialityUpdateDTO extends Partial<MedicalSpecialityDTO> {
    id: string;
};

const create = ({ medicalSpecialityData }: MedicalSpecialityData): [string?, MedicalSpecialityDTO?] => {

    const { codigo_servicio, nombre, descripcion, precio } = medicalSpecialityData;

    if (!codigo_servicio) return ['Missing codigo_servicio'];
    if (!nombre) return ['Missing nombre'];
    if (!descripcion) return ['Missing descripcion'];
    if (!precio) return ['Missing precio'];

    return [undefined, {
        codigo_servicio,
        nombre,
        descripcion,
        precio
    }];

};

const update = ({ medicalSpecialityData }: MedicalSpecialityData): [string?, MedicalSpecialityUpdateDTO?] => {

    const { codigo_servicio, nombre, descripcion, precio, id } = medicalSpecialityData;


    return [undefined, { codigo_servicio, nombre, descripcion, precio, id }];

};



export const medicalSpecialityDto = {
    create,
    update
};