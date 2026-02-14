import { BaseOAuthProvider } from './providers/base-oauth.provider';

export const OAUTH_SETTINGS = Symbol('OAuth settings');

export interface OAuthSettings {
  appBaseUrl: string;
  providers: BaseOAuthProvider[];
}
