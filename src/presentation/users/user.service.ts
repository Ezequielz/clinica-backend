import prisma from '../../lib/prisma';
import { bcryptAdapter } from '../../config/bcrypt.adapter';
import { type UserUpdateDTO } from '../../domain/dtos/auth/user.dto';


const readUsers = async () => {

  try {
    const users = await prisma.user.findMany(
      {
        omit: {
          password: true,
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
  const { id, password, ...rest } = userUpdateDTO;

  const hashedPassword = password ? await bcryptAdapter.hash(password) : undefined;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    return {
      ok: true,
      user,
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