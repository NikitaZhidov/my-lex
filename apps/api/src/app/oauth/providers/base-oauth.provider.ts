import { InternalServerErrorException } from '@nestjs/common';

import { OAuthProvider, UserProfile } from '@my-lex/shared-models';

export interface BaseOAuthProviderOptions {
  providerName: OAuthProvider;

  clientId: string;
  clientSecret: string;

  authUrl: string;
  accessUrl: string;
  profileUrl: string;

  scopes: string[];
}

export type OAuthProviderOptions = Pick<
  BaseOAuthProviderOptions,
  'clientId' | 'clientSecret' | 'scopes'
>;

export interface OAuthTokens {
  access_token: string;
  refresh_token: string;
}

export abstract class BaseOAuthProvider<TOAuthProfile = unknown> {
  private options: BaseOAuthProviderOptions;

  private APP_BASE_URL: string | undefined;

  get name() {
    return this.options.providerName;
  }

  set appBaseUrl(url: string) {
    if (url.at(-1) === '/') {
      url = url.slice(0, -1);
    }

    this.APP_BASE_URL = url;
  }

  constructor(options: BaseOAuthProviderOptions) {
    this.options = options;
  }

  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.options.clientId,
      scope: this.options.scopes.join(' '),
      redirect_uri: this.getRedirectUrl(),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'select_account',
    });

    return `${this.options.authUrl}?${params}`;
  }

  async getProfileInfoByCode(code: string): Promise<UserProfile> {
    const tokens = await this.getTokens(code);

    const oauthProfileResponse = await fetch(`${this.options.profileUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!oauthProfileResponse.ok) {
      throw new InternalServerErrorException('Failed to fetch user profile');
    }

    const oauthProfile = (await oauthProfileResponse.json()) as TOAuthProfile;

    if (!oauthProfile) {
      throw new InternalServerErrorException('Failed to parse user profile');
    }

    return this.extractUserProfile(oauthProfile);
  }

  protected abstract extractUserProfile(
    oauthProfile: TOAuthProfile,
  ): UserProfile;

  private async getTokens(code: string): Promise<OAuthTokens> {
    const params = new URLSearchParams({
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      code,
      redirect_uri: this.getRedirectUrl(),
      grant_type: 'authorization_code',
    });

    const tokensResponse = await fetch(`${this.options.accessUrl}`, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    if (!tokensResponse.ok) {
      throw new InternalServerErrorException('Failed to get user tokens');
    }

    const tokens = (await tokensResponse.json()) as OAuthTokens;

    return tokens;
  }

  private getRedirectUrl() {
    if (!this.APP_BASE_URL) {
      throw new Error('Base url is not defined');
    }

    return [
      this.APP_BASE_URL,
      `oauth/callback/${this.options.providerName}`,
    ].join('/');
  }
}
