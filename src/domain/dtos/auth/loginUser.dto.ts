import { regexp } from '../../../config/regexp';



interface LoginUser {
    userData : {[key: string]: any};
};

export interface LoginUserDTO {
    email: string;
    password: string;
};



const create = ( { userData }: LoginUser ): [string?, LoginUserDTO?] => {

    const { email, password } = userData;

    if (!email) return ['Missing email'];
    if (!regexp.email.test(email)) return ['Email is not valid'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['Password too short'];

    return [undefined, { email, password }];
};



export const loginUserDto = {
    create,
};