import { NextFunction, Request, Response } from 'express';
import Joi from "joi";
import prisma from '../../lib/prisma';
import { Rol } from '@prisma/client';
import { JwtAdapter } from '../../config/jwt.adapter';


const validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authorization = req.header('Authorization');

    if (!authorization) {
        res.status(401).json({ error: 'No token provided' });  // Responder directamente, sin 'return'
        return;  // No se debe retornar 'res', solo devolver el flujo con return sin valor.
    };

    if (!authorization.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Invalid Bearer token' });  // Responder directamente, sin 'return'
        return;  // Igual, solo salir del middleware sin retornar nada
    };

    const token = authorization.split(' ').at(1) || '';

    try {
        const payload = await JwtAdapter.validateToken<{ id: string }>(token);
        if (!payload) {
            res.status(401).json({ error: 'Invalid token' });  // Responder directamente, sin 'return'
            return;  // Salir del middleware sin retornar nada
        };

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            omit: {
                password: true,
                createdAt: true,
                updatedAt: true
            },
            include: {
                paciente: {
                    select: {
                        id_paciente: true
                    }
                },
                medico: {
                    select: {
                        id_medico: true
                    }
                },

            }
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid token - user' });  // Responder directamente, sin 'return'
            return;  // Salir del middleware sin retornar nada
        };

        req.body.user = user;
     
        next();  // Llamar a next() para continuar con la ejecución del siguiente middleware o controlador
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });  // Responder directamente en caso de error
    }
};

const validateUser = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.body.user;
    const { id } = req.params;

    if (!id) {
        res.status(401).json({ ok: false, error: 'Missing ID' });
        return;
    };
    if (!user) {
        res.status(401).json({ ok: false, error: 'Debes estar logueado para completar esta acción' });
        return;
    };


    if ((
        user.id !== id
        && user.paciente.id_paciente !== id
        && user.medico?.id_medico !== id
    ) && user.rol !== Rol.ADMIN) {
        res.status(401).json({ ok: false, error: 'No estás autorizado para esta acción' });
        return;
    };

    next();
};
const validateUserForOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const user = req.body.user;
    const { id } = req.params;


    if (!id) {
        res.status(401).json({ ok: false, error: 'Missing ID' });
        return;
    };

    if (!user) {
        res.status(401).json({ ok: false, error: 'Debes estar logueado para completar esta acción' });
        return;
    };
    try {
        if( user.rol !== Rol.ADMIN){
            const order = await prisma.order.findUnique({
                where: {id}
            });
            if (!order) {
                res.status(404).json({ ok: false, error: 'Invalid consulta ID' });  
                return; 
            };

            if ( order.pacienteId !== user.paciente.id_paciente ) {
                res.status(401).json({ ok: false, error: 'No estás autorizado a esta acción' });  
                return; 
            };
        }
        
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' }); 
    }

 

}
const validateUserForConsulta = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const user = req.body.user;
    const { id } = req.params;


    if (!id) {
        res.status(401).json({ ok: false, error: 'Missing ID' });
        return;
    };

    if (!user) {
        res.status(401).json({ ok: false, error: 'Debes estar logueado para completar esta acción' });
        return;
    };
    try {
        if( user.rol !== Rol.ADMIN){
            const consulta = await prisma.consulta.findUnique({
                where: {id}
            });
            if (!consulta) {
                res.status(404).json({ ok: false, error: 'Invalid consulta ID' });  
                return; 
            };

            if ( consulta.pacienteId !== user.paciente.id_paciente ) {
                res.status(401).json({ ok: false, error: 'No estás autorizado a esta acción' });  
                return; 
            };
        };
        
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' }); 
    }

 

};
const validateAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.body.user;
    if (!user) {
        res.status(401).json({ error: 'Debes estar logueado para completar esta acción' });
        return;
    };
    if (user.rol !== Rol.ADMIN) {
        res.status(401).json({ error: 'Debe ser Admin para completar esta acción' });
        return;
    };

    next();
};
const login = (req: Request, res: Response, next: NextFunction): void => {
    const loginSchema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
    });


    const { error, value, warning } = loginSchema.validate(req.body);

    if (error) {
        res.status(400).json({ ok: false, msg: error.message });
        return;
    };
    req.body = value;

    next();

};
const register = (req: Request, res: Response, next: NextFunction): void => {
    const registerSchema = Joi.object({
        nombre: Joi.string().required().min(3).max(20),
        apellido: Joi.string().required().min(3).max(20),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
    
        dni: Joi.string().optional(),
        fecha_nac: Joi.string().optional(),
        telefono: Joi.string().optional(),
        direccion: Joi.string().optional(),
    });


    const { error, value, warning } = registerSchema.validate(req.body);

    if (error) {
        res.status(400).json({ ok: false, msg: error.message });
        return;
    };
    req.body = value;

    next();

};

export const AuthMiddleware = {
    validateJWT,
    validateAdmin,
    validateUser,
    validateUserForConsulta,
    validateUserForOrder,
    login,
    register,

};
