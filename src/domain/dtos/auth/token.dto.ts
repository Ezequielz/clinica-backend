
import { regexp } from '../../../config/regexp';


interface TokenData {
    tokenData: { [key: string]: any };
};

export interface TokenDTO {
    id: string;
    email: string
};



const validate = ({ tokenData }: TokenData): [string?, TokenDTO?] => {

    const {
        id,
        email,
    } = tokenData;

    if (!id) return ['Missing id'];
    if (!email) return ['Missing email'];
    if (!regexp.email.test(email)) return ['Email is not valid'];

    return [undefined, {
        id,
        email,
    }];
};

export const tokenDto = {
    validate,
};