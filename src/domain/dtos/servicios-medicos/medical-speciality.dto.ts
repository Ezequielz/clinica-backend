
interface MedicalSpecialityData {
    medicalSpecialityData: { [key: string]: any }
};

export interface MedicalSpecialityDTO {
    codigo_servicio: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen?: string
};

export interface MedicalSpecialityUpdateDTO extends Omit<Partial<MedicalSpecialityDTO>, 'codigo_servicio'> {
    id: string;
}

const create = ({ medicalSpecialityData }: MedicalSpecialityData): [string?, MedicalSpecialityDTO?] => {

    const { codigo_servicio, nombre, descripcion, precio, imagen } = medicalSpecialityData;

    if (!codigo_servicio) return ['Missing codigo_servicio'];
    if (!nombre) return ['Missing nombre'];
    if (!descripcion) return ['Missing descripcion'];
    if (!precio) return ['Missing precio'];

    return [undefined, {
        codigo_servicio,
        nombre,
        descripcion,
        precio: +precio,
        imagen
    }];

};

const update = ({ medicalSpecialityData }: MedicalSpecialityData): [string?, MedicalSpecialityUpdateDTO?] => {

    const { nombre, descripcion, precio, imagen, id } = medicalSpecialityData;


    return [undefined, { nombre, descripcion,  precio: +precio, imagen, id }];

};



export const medicalSpecialityDto = {
    create,
    update
};