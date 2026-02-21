import { UserProfile } from '@my-lex/shared-models';

import { api } from '@/lib';

export class UsersService {
  async getMyProfile(): Promise<UserProfile> {
    return api.get<UserProfile>('/users/profile');
  }
}

export const usersService = new UsersService();
