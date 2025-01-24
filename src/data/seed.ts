import { Rol } from '@prisma/client';
import prisma from '../lib/prisma';
import { seed } from './data';





async function main() {

    await prisma.turno.deleteMany();
    await prisma.paciente.deleteMany();
    await prisma.medico.deleteMany();
    await prisma.user.deleteMany();
    await prisma.servicio.deleteMany();


    const { users, pacientes, medicos, servicios } = seed

    await prisma.servicio.createMany({
        data: servicios
    });

    await prisma.user.createMany({
        data: users
    })

    const usersToPaciente = await prisma.user.findMany()


    await Promise.all(
        usersToPaciente.map((user, index) => {
            return prisma.paciente.create({
                data: {
                    userId: user.id,
                    obra_social: pacientes[index]?.obra_social || false, // Asocia obra social
                },
            });
        })
    );

    // Asociar médicos con sueldo, especialidad y turnos
    const usersToMedico = await prisma.user.findMany({
        skip: 5
    });

    await Promise.all(
        usersToMedico.map((user, index) => {
            const medico = medicos[index] ?? medicos[4]; // Obtiene los datos del médico correspondiente
            return prisma.medico.create({
                data: {
                    userId: user.id,
                    sueldo: medico.sueldo,
                    especialidadId: medico.especialidadId,
                    turnos: {
                        create: medico.turnos.map((turno) => ({
                            dia_semana: turno.dia_semana,
                            hora_inicio: turno.hora_inicio,
                            hora_fin: turno.hora_fin,
                        })),
                    },
                },
            });
        })
    );


    console.log('Seed Ejecutado correctamente')


}


(() => {
    if (process.env.NODE_ENV === 'production') return;
    main();
})();