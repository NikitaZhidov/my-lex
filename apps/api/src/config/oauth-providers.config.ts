import { ConfigService } from '@nestjs/config';

import { OAuthSettings } from '../app/oauth/oauth.constants';
import { GoogleOAuthProvider } from '../app/oauth/providers/google-oauth.provider';

export const OAuthProviderConfigFactory = (
  configService: ConfigService,
): OAuthSettings => ({
  appBaseUrl: configService.getOrThrow<string>('API_BASE_URL'),
  providers: [
    new GoogleOAuthProvider({
      clientId: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      scopes: ['profile', 'email'],
    }),
  ],
});
