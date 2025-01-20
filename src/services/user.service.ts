

import { User } from '../interfaces/user';


const users: User[] = [
    {
        id: '1',
        nombre: 'Ezequiel',
        apellido: 'Zapata',
        dni: 34123456,
        fecha_nac: new Date('1989-29-12'),
        email: 'zapata.ed1989@gmail.com',
        password: '123',
        telefono: 1534689741,
        direccion: 'Lanus, Buenos Aires',
        rol: 'admin',
        obra_social: true,
        createAt: new Date(),
    },

]


const getUserById = ( id : string) => {
    return users.find( user => user.id === id);
}


export const UsersService = {
    users,

    // Methods
    getUserById,

}