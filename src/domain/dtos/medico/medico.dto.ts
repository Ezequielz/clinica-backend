import { Turno } from "@prisma/client";

interface MedicoData {
    medicoData: { [key: string]: any };
};

export interface MedicoDTO {
    userId: string;
    sueldo: number;
    especialidadId: string;
    turnos?: Turno[]
};

export interface MedicoUpdateDTO extends Partial<Omit<MedicoDTO, "userId">> {
    id: string;
}

const create = ({ medicoData }: MedicoData): [string?, MedicoDTO?] => {

    const { userId, sueldo, especialidadId, turnos } = medicoData;

    if (!userId) return ['Missing userId'];
    if (!sueldo) return ['Missing sueldo'];
    if (!especialidadId) return ['Missing especialidadId'];

    return [undefined, {
        userId,
        sueldo: +sueldo,
        especialidadId,
        turnos
    }];
    
};

const update = ({ medicoData }: MedicoData): [string?, MedicoUpdateDTO?] => {

    const { sueldo, especialidadId, turnos, id } = medicoData;

    if (!id) return ['Missing id'];

    return [undefined, {
        id,
        sueldo: +sueldo,
        especialidadId,
        turnos,
    }];
    
};



export const medicoDto = {
    create,
    update,
};