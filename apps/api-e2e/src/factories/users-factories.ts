import { type CreateUser } from '@my-lex/shared-models';

import { prisma } from './prisma';

export const mockUser: Omit<CreateUser, 'passwordRepeat'> = {
  email: 'test@test.com',
  name: 'test-user',
  password: '123456',
};

export const createUser = async (user: typeof mockUser) => {
  return await prisma.user.create({
    data: {
      displayName: user.name,
      email: user.email,
      password: user.password,
    },
  });
};
