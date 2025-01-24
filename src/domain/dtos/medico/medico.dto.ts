
interface MedicoData {
    medicoData: { [key: string]: any };
};

export interface MedicoDTO {
    userId: string;
    sueldo: number;
    especialidadId: string;
};

export interface MedicoUpdateDTO extends Partial<MedicoDTO> {
    id: string;
};


const create = ({ medicoData }: MedicoData): [string?, MedicoDTO?] => {

    const { userId, sueldo, especialidadId } = medicoData;

    if (!userId) return ['Missing userId'];
    if (!sueldo) return ['Missing sueldo'];
    if (!especialidadId) return ['Missing especialidadId'];

    return [undefined, {
        userId,
        sueldo,
        especialidadId,
    }];
    
};

const update = ({ medicoData }: MedicoData): [string?, MedicoUpdateDTO?] => {

    const { userId, sueldo, especialidadId, id } = medicoData;

    if (!id) return ['Missing id'];

    return [undefined, {
        id,
        userId,
        sueldo,
        especialidadId,
    }];
    
};



export const medicoDto = {
    create,
    update,
};