import { UserProfile } from '@my-lex/shared-models';

import { BaseOAuthProvider, OAuthProviderOptions } from './base-oauth.provider';

export interface GoogleProfile {
  sub: string;
  id?: string;
  email?: string;
  email_verified?: boolean;
  verified_email?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  hd?: string;
}

export class GoogleOAuthProvider extends BaseOAuthProvider<GoogleProfile> {
  constructor(options: OAuthProviderOptions) {
    super({
      providerName: 'google',
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      scopes: options.scopes,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      accessUrl: 'https://oauth2.googleapis.com/token',
      profileUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });
  }

  protected override extractUserProfile(
    oauthProfile: GoogleProfile,
  ): UserProfile {
    if (!oauthProfile.email) {
      throw new Error('Invalid user google info');
    }

    return {
      email: oauthProfile.email,
      name: oauthProfile.name ?? oauthProfile.email,
      picture: oauthProfile.picture ?? null,
    };
  }
}
