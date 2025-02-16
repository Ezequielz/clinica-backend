import { Rol } from '@prisma/client';
import { regexp } from '../../../config/regexp';


interface UserData {
    userData: { [key: string]: any };
};

export interface UserDTO {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol?: Rol;
    dni?: string;
    fecha_nac?: Date;
    telefono?: string;
    direccion?: string;

};
export interface UserUpdateDTO extends Partial<Omit<UserDTO, 'email'>> {
    id: string;
    obra_social?: boolean;
    imagen?: string;
};


const create = ({ userData }: UserData): [string?, UserDTO?] => {

    const {
        nombre,
        apellido,
        email,
        password,
        rol,
        dni,
        fecha_nac,
        telefono,
        direccion,
    } = userData;

    if (!nombre) return ['Missing nombre'];
    if (!apellido) return ['Missing apellido'];
    if (!email) return ['Missing email'];
    if (!regexp.email.test(email)) return ['Email is not valid'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['Password too short'];
    const normalizedRol = rol?.toUpperCase();
    if (rol && !Object.values(Rol).includes(normalizedRol as Rol)) {
        return ['Tipo de Rol no permitido'];
    };
    return [undefined, {
        nombre,
        apellido,
        email,
        password,
        rol: normalizedRol,
        dni,
        fecha_nac,
        telefono,
        direccion,
    }];
};

const update = ({ userData }: UserData): [string?, UserUpdateDTO?] => {

    const {
        id,
        nombre,
        apellido,
        password,
        rol,
        dni,
        imagen,
        fecha_nac,
        telefono,
        direccion,
        obra_social,
    } = userData;

    if (!id) return ['Missing id'];
    const normalizedRol = rol?.toUpperCase();
    if (rol && !Object.values(Rol).includes(normalizedRol as Rol)) {
        return ['Tipo de Rol no permitido'];
    };


    const filteredUserData: UserUpdateDTO = {
        id,
        ...(nombre && nombre !== '' && { nombre }),
        ...(apellido && apellido !== '' && { apellido }),
        ...(password && password !== '' && { password }),
        ...(rol && rol !== '' && { rol: normalizedRol }),
        ...(dni && dni !== '' && { dni }),
        ...(imagen && imagen !== '' && { imagen }),
        ...(fecha_nac && fecha_nac !== '' && { fecha_nac }),
        ...(telefono && telefono !== '' && { telefono }),
        ...(direccion && direccion !== '' && { direccion }),
        ...(obra_social !== undefined && { obra_social }),
    };


    return [undefined, filteredUserData];
};



export const userDto = {
    create,
    update,
};