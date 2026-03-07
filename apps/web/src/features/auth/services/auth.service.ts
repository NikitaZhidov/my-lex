import { CreateUser, LoginUser, OAuthProvider } from '@my-lex/shared-models';

import { recaptchaEnabled } from '@/features/recaptcha';
import { api, ApiError } from '@/lib';

export class AuthService {
  async login(loginInfo: LoginUser, recaptcha?: string) {
    this.validateRecaptcha(recaptcha);

    const headers: Record<string, string> = { recaptcha: recaptcha ?? '' };

    return api.post('/auth/login', loginInfo, { headers });
  }

  async register(registerInfo: CreateUser, recaptcha?: string) {
    this.validateRecaptcha(recaptcha);

    const headers: Record<string, string> = { recaptcha: recaptcha ?? '' };

    return api.post('/auth/register', registerInfo, { headers });
  }

  async logout() {
    return api.post('/auth/logout');
  }

  async getProviderAuthUrl(provider: OAuthProvider) {
    return api.get<{ authUrl: string }>(`/oauth/connect/${provider}`);
  }

  private validateRecaptcha(recaptcha?: string) {
    if (recaptchaEnabled() && !recaptcha) {
      throw new ApiError(400, { message: 'auth.completeRecaptcha' });
    }
  }
}

export const authService = new AuthService();
