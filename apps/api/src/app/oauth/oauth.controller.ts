import { Controller, Get, Param, Query, Session } from '@nestjs/common';
import { type Request } from 'express';

import { type OAuthProvider } from '@my-lex/shared-models';

import { OAuthService } from './oauth.service';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Get('connect/:provider')
  getAuthUrl(@Param('provider') provider: OAuthProvider) {
    const authUrl = this.oauthService.getAuthUrl(provider);

    return { authUrl };
  }

  @Get('callback/:provider')
  callbackHandler(
    @Param('provider') provider: OAuthProvider,
    @Query('code') code: string,
    @Session() session: Request['session'],
  ) {
    return this.oauthService.loginUserByCode(provider, code, session);
  }
}
