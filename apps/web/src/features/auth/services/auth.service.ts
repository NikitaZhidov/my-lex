import { LoginUser } from '@my-lex/shared-models';

import { api } from '@/lib';

export class AuthService {
  login(loginInfo: LoginUser) {
    return api.post('/auth/login', loginInfo);
  }
}

export const authService = new AuthService();
