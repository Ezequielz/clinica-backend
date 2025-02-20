import prisma from '../../lib/prisma';
import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { type UserUpdateDTO } from '../../domain/dtos/auth/user.dto';


const readUsers = async () => {

  try {
    const users = await prisma.user.findMany(
      {
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      }
    );

    return {
      ok: true,
      users
    };

  } catch (error) {
    console.log(error);

    return {
      ok: false,
      msg: 'Error al obtener los usuarios'
    };
  }

};


const readUserById = async (id: string) => {

  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      omit: {
        password: true,
      },
      include: {
        medico: true,
        paciente: true
      }
    });


    return {
      ok: true,
      user
    };

  } catch (error: any) {
    console.error(error);

    if (error.code === 'P2025') {

      return {
        ok: false,
        user: null,
        msg: 'Usuario no encontrado',
      };
    }
    return {
      ok: false,
      msg: 'Error al obtener el usuario'
    };
  }

};


const updateUser = async (userUpdateDTO: UserUpdateDTO) => {
  const { id, password, fecha_nac, obra_social, ...rest } = userUpdateDTO;


  const hashedPassword = password ? await bcryptAdapter.hash(password) : undefined;
  const fechaToDate = fecha_nac ? new Date(fecha_nac) : undefined

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const paciente = await prisma.paciente.update({
        where: { userId: id },
        data: { obra_social },
      });

      const user = await prisma.user.update({
        where: { id },
        data: {
          ...rest,
          ...(hashedPassword && { password: hashedPassword }),
          ...(fechaToDate && { fecha_nac: fechaToDate }),
        },
      });

      return { user, paciente };
    });

    return {
      ok: true,
      user: result.user,
    };

  } catch (error: any) {
    console.error(error);

    if (error.code === 'P2025') {

      return {
        ok: false,
        user: null,
        msg: 'Usuario no encontrado',
      };
    }


    return {
      ok: false,
      msg: 'Error al actualizar usuario',
    };
  }
};

const deleteUser = async (id: string) => {

  try {
    const user = await prisma.user.delete({
      where: {
        id
      }
    });

    return {
      ok: true,
      user: {
        id: user.id,
        nombre: user.nombre + ' ' + user.apellido
      }
    };

  } catch (error: any) {
    console.error(error);

    if (error.code === 'P2025') {

      return {
        ok: false,
        user: null,
        msg: 'Usuario no encontrado',
      };
    }


    return {
      ok: false,
      msg: 'Error al eliminar usuario'
    };
  }

};


export const UsersService = {
  // Methods
  readUsers,
  readUserById,
  updateUser,
  deleteUser,

};