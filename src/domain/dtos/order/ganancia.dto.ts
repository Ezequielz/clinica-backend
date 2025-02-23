interface GananciasData {
    gananciaData: { [key: string]: any };
};

export interface GananciasDTO {
    month?: Month;
    year?: number;
    typo?: 'servicio' | 'pack';
};

type Month = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11";

const create = ({ gananciaData }: GananciasData): [string?, GananciasDTO?] => {
    const { month, year, typo } = gananciaData;

    if (typo && typo !== 'servicio' && typo !== 'pack') {
        return ['typo solo puede ser "servicio" o "pack"'];
    }

    if (month && !(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"] as const).includes(month)) {
        return ['month debe ser un valor entre "0" y "11"'];
    }

    if (year !== undefined) {
        const parsedYear = parseInt(year);
        if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear()) {
            return ['year debe ser un número válido entre 1900 y el año actual'];
        }
    }

    return [undefined, { month, year, typo }];
};

export const gananciasDto = { create };
