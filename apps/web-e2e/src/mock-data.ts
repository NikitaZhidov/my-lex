import { type UserProfile } from '@my-lex/shared-models';

export const e2eUser: Omit<UserProfile, 'id'> & { password: string } = {
  email: 'test-user@test.com',
  password: '123456',
  name: 'User123',
  picture: '',
};
