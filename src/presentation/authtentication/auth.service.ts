import prisma from '../../lib/prisma';
import { CustomError } from '../helpers/custom.error';

import { bcryptAdapter } from '../../config/bcrypt.adapter';

import { LoginUserDTO } from '../../domain/dtos/auth/loginUser.dto';
import { UserDTO } from '../../domain/dtos/auth/user.dto';
import { JwtAdapter } from '../../config/jwt.adapter';

import { pacienteDto } from '../../domain/dtos/paciente/paciente.dto';



const registerUser = async (registerUserDto: UserDTO) => {

  const existUser = await prisma.user.findUnique({ where: { email: registerUserDto.email } });

  if (existUser) throw CustomError.badRequest('Email already exist');

  try {

    registerUserDto.password = bcryptAdapter.hash(registerUserDto.password);

    const newUser = await prisma.user.create({
      data: registerUserDto
    });


    const [error, paciente] = pacienteDto.create({ pacienteData: { userId: newUser.id } })
    if (error) throw CustomError.badRequest('Erro al crear paciente');

    await prisma.paciente.create({
      data: paciente!
    });

    return {
      user: newUser,
      token: 'ABC'
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



export const AuthService = {
  // Methods
  registerUser,
  loginUser,
};