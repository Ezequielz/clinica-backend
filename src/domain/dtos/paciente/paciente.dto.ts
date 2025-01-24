
interface PacienteData {
    pacienteData: { [key: string]: any }
};

export interface PacienteDTO {
    userId: string;
    obra_social: boolean;
};

export interface PacienteUpdateDTO {
    userId: string;
    obra_social?: boolean
};


const create = ({ pacienteData }: PacienteData): [string?, PacienteDTO?] => {

    const { userId, obra_social } = pacienteData;

    if (!userId) return ['Missing userId'];

    return [undefined, {
        userId,
        obra_social
    }];
    
};

const update = ({ pacienteData }: PacienteData): [string?, PacienteUpdateDTO?] => {

    const { userId, obra_social } = pacienteData;

    if (!userId) return ['Missing userId'];

    return [undefined, {
        userId,
        obra_social,
    }];
    
};



export const pacienteDto = {
    create,
    update
};