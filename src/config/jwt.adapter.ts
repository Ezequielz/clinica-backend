import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export const JwtAdapter = {
  // Generar un token
  generateToken: async (payload: any, duration: string = '2h') => {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        resolve(token);
      });
    });
  },

  // Validar un token (aún no implementado)
  validateToken: (token: string) => {
    throw new Error('Not implemented');
  },
};
