import { userDoc } from "./users.doc";


export const optionsDocs = {
    info: {
        title: 'API - Clinica',
        version: '1.0.0',
        description: 'Documentación de la clinica',
        contact: {
            name: "Ezequiel Zapata",
            email: "zapata.ed1989@gmail.com",
        },
    },
    basePath: '/api',
    paths: {
        ...userDoc.paths,
    },
    tags: [...userDoc.tags],

}  