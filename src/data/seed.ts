import { Rol } from '@prisma/client';
import prisma from '../lib/prisma';
import { seed } from './data';





async function main() {

    await prisma.paqueteServicio.deleteMany();
    await prisma.paquete.deleteMany();
    await prisma.turno.deleteMany();
    await prisma.paciente.deleteMany();
    await prisma.medico.deleteMany();
    await prisma.user.deleteMany();
    await prisma.servicio.deleteMany();


    const { users, medicos, servicios } = seed

    await prisma.servicio.createMany({
        data: servicios
    });
    const services = await prisma.servicio.findMany();
    console.log(`${services.length} servicios creados`)

    await prisma.user.createMany({
        data: users
    })

    const usersToPaciente = await prisma.user.findMany()
    console.log(`${usersToPaciente.length} usuarios creados`)

    await Promise.all(
        usersToPaciente.map((user, index) => {
            return prisma.paciente.create({
                data: {
                    userId: user.id,
                    obra_social: index < 5 ? true : false, // Asocia obra social
                },
            });
        })
    );
    const pacienteswhitoutObra_SocialCount = await prisma.paciente.count({where: {obra_social: false}});
    const pacienteswhitObra_SocialCount = await prisma.paciente.count({where: {obra_social: true}});
    console.log(`${pacienteswhitoutObra_SocialCount ?? 0} usuarios son pacientes sin obra social`)
    console.log(`${pacienteswhitObra_SocialCount ?? 0} usuarios son pacientes con obra social`)
  
    const usersToMedico = await prisma.user.findMany({
        skip: 11
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
                            dia_semana: turno.dia_semana.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
                            hora_inicio: turno.hora_inicio,
                            hora_fin: turno.hora_fin,
                        })),
                    },
                },
            });
        })
    );

    const medicosCount = await prisma.medico.count();
    console.log(`${medicosCount ?? 0} medicos creados`)

    if (services.length >= 2) {
        const quantityPacks = 5

        for (let i = 1; i <= quantityPacks; i++) {

            // Seleccionar 2 o 3 servicios random en cada paquete
            const serviciosSeleccionados = services
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * (3 - 2 + 1)) + 2);


            // total de precio sumando los servicios
            const precioTotalServicios = serviciosSeleccionados.reduce((total, servicio) => total + servicio.precio, 0);
            // 15% descuento
            const precio_paquete = precioTotalServicios * 0.85;
            // codigo random del paquete
            const codigo_paquete = `PACK${String(i).padStart(3, '0')}`


            // Crear un paquete
            const paquete = await prisma.paquete.create({
                data: {
                    codigo_paquete,
                    nombre: `Paquete Especial ${i}`,
                    precio_paquete
                },
            });

            // Asociar servicios al paquete
            const paqueteServiciosData = serviciosSeleccionados.map((servicio) => ({
                paqueteId: paquete.codigo_paquete,
                servicioId: servicio.codigo_servicio,
            }));

            await prisma.paqueteServicio.createMany({
                data: paqueteServiciosData,
            });

        }

    } else {
        console.log('Debe haber minimo 2 servicios para poder crear 1 o mas paquete de servicios')
        console.log(`Hay ${services.length ?? 0} servicios creados`)
    }


    const paquetesCount = await prisma.paquete.count();
    console.log(`${paquetesCount ?? 0} paquetes creados`)



    console.log('Seed Ejecutado correctamente')


}


(() => {
    if (process.env.NODE_ENV === 'production') return;
    main();
})();