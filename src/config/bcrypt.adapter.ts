import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

const hash = (password: string) => {
  const salt = genSaltSync();
  return hashSync(password, salt)
};

const compare = (password: string, hashed: string) => {
  return compareSync(password, hashed);
};

export const bcryptAdapter = {
  hash,
  compare,
};