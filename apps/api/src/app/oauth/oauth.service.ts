import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type Request } from 'express';

import { OAuthProvider } from '@my-lex/shared-models';

import { AuthService } from '../auth/auth.service';

import { OAUTH_SETTINGS, type OAuthSettings } from './oauth.constants';

@Injectable()
export class OAuthService {
  constructor(
    @Inject(OAUTH_SETTINGS)
    private readonly settings: OAuthSettings,
    private readonly authService: AuthService,
  ) {
    this.settings.providers.forEach(p => (p.appBaseUrl = settings.appBaseUrl));
  }

  getAuthUrl(providerName: OAuthProvider) {
    return this.getProvider(providerName).getAuthUrl();
  }

  async loginUserByCode(
    providerName: OAuthProvider,
    code: string,
    session: Request['session'],
  ) {
    const provider = this.getProvider(providerName);
    const profile = await provider.getProfileInfoByCode(code);

    return this.authService.loginOrRegister(profile, session);
  }

  private getProvider(providerName: OAuthProvider) {
    const provider = this.settings.providers.find(
      pr => pr.name === providerName,
    );

    if (!provider) {
      throw new NotFoundException('exceptions.unknownAuthProvider');
    }

    return provider;
  }
}
