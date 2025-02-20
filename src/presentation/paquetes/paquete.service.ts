import prisma from '../../lib/prisma';
import { CustomError } from '../helpers/custom.error';
import { checkExistCodigo_servicio } from '../helpers/checkExistCodigo_servicio';
import type { PaqueteDTO, PaqueteUpdateDTO } from '../../domain/dtos/paquete/paquete.dto';
import { calculateDiscountedPrice } from '../helpers/calculateDiscountedPrice';
import { checkExistPaquete } from '../helpers/checkExistPaquete';


const createPaquete = async (paqueteDTO: PaqueteDTO) => {

    const { serviciosCodes, codigo_paquete, nombre, imagen, } = paqueteDTO;
    for (const codigo of paqueteDTO.serviciosCodes) {
        const {ok} = await checkExistCodigo_servicio(codigo);
        if (!ok) {
            throw CustomError.badRequest(`codigo de servicio: ${codigo} inválido, no existente`);
        }
    }

    const existCodeInPaquete = await readPaqueteByCode(paqueteDTO.codigo_paquete)

    if (existCodeInPaquete.paquete) {
        throw CustomError.badRequest(`codigo de paquete: ${paqueteDTO.codigo_paquete} inválido, ya existe en otro paquete`);
    }

    try {

        const servicios = await prisma.servicio.findMany({
            where: {
                codigo_servicio: {
                    in: serviciosCodes,
                },
            },
            select: {
                precio: true,
            },
        });

        const totalFullPrice = servicios.reduce((sum, servicio) => sum + servicio.precio, 0);
        const precioWhitDicount = totalFullPrice * 0.85

        const paquete = await prisma.paquete.create({
            data: {
                nombre,
                imagen,
                codigo_paquete: codigo_paquete.toUpperCase(),
                precio_paquete: precioWhitDicount
            }
        });


        const { ok } = await setPaqueteServicios(paqueteDTO.codigo_paquete, serviciosCodes);
        if (!ok) throw CustomError.internalServer(`Error al crear la relacion de paquetes y servicios`);

        return {
            ok: true,
            paquete
        };

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            msg: 'Error al crear paquete'
        };
    }
};
const readPaquetes = async () => {

    try {
        const paquetes = await prisma.paquete.findMany({
            omit: {
                createdAt: true,
                updatedAt: true,
                id: true
            },
            include: {
                servicios_incluidos: {
                    omit: {
                        paqueteId: true,
                        servicioId: true,
                        createdAt: true,
                        updatedAt: true,
                        id: true,
                    },
                    include: {
                        servicio: {
                            select: {
                                nombre: true,
                                precio: true,
                                descripcion: true,
                                medicos: {
                                    select: {
                                        turnos: {
                                            omit: {
                                                medicoId: true,
                                                id_turno: true,
                                            }
                                        },
                                        user: {
                                            select: {
                                                nombre: true,
                                                apellido: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return {
            ok: true,
            paquetes
        };

    } catch (error) {
        console.log(error);

        return {
            ok: false,
            msg: 'Error al obtener los paquetes'
        };
    }

};

const readPaqueteByCode = async (code: string) => {

    try {
        const paquete = await prisma.paquete.findFirst({
            where: {
                codigo_paquete: {
                    equals: code,
                    mode: "insensitive", // Asegura la insensibilidad a mayúsculas/minúsculas
                },
            },
            omit: {
                createdAt: true,
                updatedAt: true,
            
            },
            include: {
                servicios_incluidos: {
                    omit: {
                        paqueteId: true,
                        
                        createdAt: true,
                        updatedAt: true,
                        id: true,
                    },
                    include: {
                        servicio: {
                            select: {
                                id: true,
                                nombre: true,
                                codigo_servicio: true,
                                precio: true,
                                descripcion: true,
                                medicos: {
                                    select: {
                                        id_medico: true,
                                        turnos: true,
                                        user: {
                                            select: {
                                                nombre: true,
                                                apellido: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return {
            ok: true,
            paquete
        };

    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {

            return {
                ok: false,
                paquete: null,
                msg: 'paquete no encontrado',
            };
        }

        return {
            ok: false,
            msg: 'Error al obtener los paquetes'
        };
    }

};

const updatePaquete = async (paqueteUpdateDTO: PaqueteUpdateDTO) => {
    const { id, ...rest } = paqueteUpdateDTO;

    const existPaquete = await checkExistPaquete(id);
    if (!existPaquete) throw CustomError.badRequest(`no se encontro paquete con id ${id}`);

    try {

        const paqueteUpdated = await prisma.paquete.update({
            where: { id },
            data: {
                ...rest,
            },
        });

        return {
            ok: true,
            paquete: paqueteUpdated,
        };
    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {

            return {
                ok: false,
                paquete: null,
                msg: 'paquete no encontrado',
            };
        }
        return {
            ok: false,
            error
        }
    }
};

const deletePaquete = async (code: string) => {

    const validCode = await readPaqueteByCode(code);
    if (!validCode)  throw CustomError.badRequest(`codigo de paquete: ${code} inválido, no existente`);

    try {

        await prisma.paqueteServicio.deleteMany({
            where: {
                paqueteId: {
                    equals: code,
                    mode: "insensitive",
                },
            }
        });
        
        const paqueteDeleted = await prisma.paquete.delete({
            where: {
                codigo_paquete: code.toUpperCase()
            }
        });

        return {
            ok: true,
            paquete: paqueteDeleted
        }
        
    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {

            return {
                ok: false,
                paquete: null,
                msg: 'paquete no encontrado',
            };
        }
        return {
            ok: false,
            error
        }
    }
};


const setPaqueteServicios = async (codigo_paquete: string, serviciosCodes: string[]) => {
    const paqueteServiciosData = serviciosCodes.map((servicio) => ({
        paqueteId: codigo_paquete.toUpperCase(),
        servicioId: servicio,
    }));

    try {
        await prisma.paqueteServicio.deleteMany({ where: { paqueteId: codigo_paquete } });
        await prisma.paqueteServicio.createMany({ data: paqueteServiciosData });

        return {
            ok: true
        }
    } catch (error) {
        return {
            ok: false
        }
    }


};


export const PaquetesService = {
    // Methods
    createPaquete,
    readPaquetes,
    readPaqueteByCode,
    updatePaquete,
    deletePaquete,

};