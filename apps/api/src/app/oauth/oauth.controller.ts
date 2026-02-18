import { Controller, Get, Param, Query, Res, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Request, type Response } from 'express';

import { type OAuthProvider } from '@my-lex/shared-models';

import { LoginHandlerFactory } from '../auth/features/login-handler/login-handler';

import { OAuthService } from './oauth.service';

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly loginHandlerFactory: LoginHandlerFactory,
    private readonly configService: ConfigService,
  ) {}

  @Get('connect/:provider')
  getAuthUrl(@Param('provider') provider: OAuthProvider) {
    const authUrl = this.oauthService.getAuthUrl(provider);

    return { authUrl };
  }

  @Get('callback/:provider')
  async callbackHandler(
    @Param('provider') provider: OAuthProvider,
    @Query('code') code: string,
    @Session() session: Request['session'],
    @Res() res: Response,
  ) {
    await this.oauthService.loginUserByCode(
      provider,
      code,
      this.loginHandlerFactory.create(session, res),
    );

    return res.redirect(
      `${this.configService.getOrThrow<string>('WEB_APP_BASE_URL')}`,
    );
  }
}
