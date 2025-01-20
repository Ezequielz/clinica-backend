

export interface User {
    id: string;
    nombre: string;
    apellido: string;
    dni: number;
    fecha_nac: Date;
    email: string;
    password: string;
    telefono: number;
    direccion: string;
    rol: string;
    obra_social: boolean;
    createAt: Date;
}


export interface Doctor extends User {
    especialidad: string;
    matricula: number;
    turnos: Turno[];
    sueldo: number;
    horario: string;
    dias: string;
    consultorio: string;
}