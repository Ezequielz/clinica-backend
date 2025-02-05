import prisma from '../../lib/prisma';

const readInfo = async () => {

    try {

        const [serviciosMedicos, pacientes, medicos, paquetes] = await Promise.all([
            prisma.servicio.count(),
            prisma.paciente.count(),
            prisma.medico.count(),
            prisma.paquete.count(),
        ]);


        return {
            ok: true,
            serviciosMedicos,
            pacientes,
            medicos,
            paquetes,
        };

    } catch (error: any) {
    
        return {
            ok: false,
            msg: 'Error al obtener info'
        };
    };
};



export const InfoService = {
    // Methods  
    readInfo,
};