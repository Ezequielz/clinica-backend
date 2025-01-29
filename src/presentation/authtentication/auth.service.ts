import prisma from '../../lib/prisma';
import { JwtAdapter } from '../../config/jwt.adapter';
import { bcryptAdapter } from '../../config/bcrypt.adapter';

import { CustomError } from '../helpers/custom.error';

import { type LoginUserDTO } from '../../domain/dtos/auth/loginUser.dto';
import { type UserDTO } from '../../domain/dtos/auth/user.dto';

import { pacienteDto } from '../../domain/dtos/paciente/paciente.dto';
import { type TokenDTO } from '../../domain/dtos/auth/token.dto';



const registerUser = async (registerUserDto: UserDTO) => {

  const existUser = await prisma.user.findUnique({ where: { email: registerUserDto.email } });

  if (existUser) throw CustomError.badRequest('Email already exist');

  try {

    registerUserDto.password = bcryptAdapter.hash(registerUserDto.password);

    const newUser = await prisma.user.create({
      data: registerUserDto
    });


    const [error, paciente] = pacienteDto.create({ pacienteData: { userId: newUser.id } })
    if (error) throw CustomError.badRequest('Error al crear paciente');

    await prisma.paciente.create({
      data: paciente!
    });

    const token = await JwtAdapter.generateToken({ id: newUser.id, email: newUser.email });
    if (!token) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: newUser,
      token
    };

  } catch (error) {
    return CustomError.internalServer(`${error}`);
  };

};
const loginUser = async (loginUserDTO: LoginUserDTO) => {


  const user = await prisma.user.findUnique({ where: { email: loginUserDTO.email } });
  if (!user) throw CustomError.badRequest('Invalid Credentials');

  const isMatching = bcryptAdapter.compare(loginUserDTO.password, user.password);
  if (!isMatching) throw CustomError.badRequest('Invalid Credentials');

  const { password, ...restUser } = user;


  const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
  if (!token) throw CustomError.internalServer('Error while creating JWT');


  return {
    ok: true,
    user: {
      ...restUser,
      token,
    },
  }


};
const renewToken = async (tokenDTO: TokenDTO) => {

  const token = await JwtAdapter.generateToken({ id: tokenDTO.id, email: tokenDTO.email });
  if (!token) throw CustomError.internalServer('No se pudo renovar el token');

  return {
    ok: true,
    token
  };
};

export const AuthService = {
  // Methods
  registerUser,
  loginUser,
  renewToken,
};