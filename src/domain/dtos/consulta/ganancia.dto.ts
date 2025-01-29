
interface GananciasData {
    gananciaData: { [key: string]: any };
};
export interface GananciasDTO {
    fecha_inicio?: string;
    fecha_fin?: string
    typo?: 'servicio' | 'pack'
};

const create = ({ gananciaData }: GananciasData): [string?, GananciasDTO?] => {

    const {
        fecha_inicio,
        fecha_fin,
        typo,
    } = gananciaData;

    if (!fecha_inicio) return ['Missing fecha_inicio'];
    if (typo && typo !== 'servicio' && typo !== 'pack')return ['typo solo puede ser "servicio" o "pack"'];

    return [undefined, {
        fecha_inicio,
        fecha_fin,
        typo,
    }];

};


export const gananciasDto = {
    create,
  
};