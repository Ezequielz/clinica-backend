import { Router } from 'express';
import { PacientesController } from './PacientesController';



export const PacientesRoutes = (): Router => {
    const router = Router();

    // /api/pacientes
    const {
        readPacientes,
        readPacienteById,
        updatePaciente,
       
    } = PacientesController;
    /**
       * @swagger
       * /users/paciente:
       *   get:
       *     tags:
       *       - Users
       *     description: Obtener todos los pacientes
      *     responses:
      *       404:
      *         description: Error al obtener lista de usuarios
      *         schema:
      *           type: object
      *           properties:
      *             ok:
      *               type: boolean
      *               example: false
      *             msg:
      *               type: string
      *               example: No se encontraron pacientes
      *       200:
      *         description: Lista de usuarios
      *         schema:
      *           type: object
      *           properties:
      *             ok:
      *               type: boolean
      *               example: true
      *             users:
      *               type: array
      *               items:
      *                 type: object
      *                 properties:
      *                   nombre:
      *                     type: string
      *                     example: Juan
      *                   apellido:
      *                     type: string
      *                     example: Pérez
      *                   email:
      *                     type: string
      *                     example: juan.perez@example.com
      *                   paciente:
      *                      type: array
      *                      items:
      *                        type: object
      *                        properties:
      *                          obra_social:
      *                              type: boolean
      *                              example: true
      *                          Consulta: 
      *                              type: array
      *                              items:
      *                                 type: object
      *                                 properties:
      *                                  fecha_consulta:
      *                                      type: string
      *                                      example: 20/2/2025
      *                                  hora_consulta:
      *                                      type: string
      *                                      example: 08:00
      *                                  pagado_o_no:
      *                                      type: boolean
      *                                      example: false
      *                          TurnoReservado:
      *                              type: array
       */
    router.get('/', readPacientes);
    router.get('/:id', readPacienteById);

    router.patch('/:id', updatePaciente);


    return router;
};