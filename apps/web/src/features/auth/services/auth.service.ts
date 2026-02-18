import { CreateUser, LoginUser, OAuthProvider } from '@my-lex/shared-models';

import { api } from '@/lib';

export class AuthService {
  async login(loginInfo: LoginUser) {
    return api.post('/auth/login', loginInfo);
  }

  async register(registerInfo: CreateUser) {
    return api.post('/auth/register', registerInfo);
  }

  async getProviderAuthUrl(provider: OAuthProvider) {
    return api.get<{ authUrl: string }>(`/oauth/connect/${provider}`);
  }
}

export const authService = new AuthService();
