import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { type OAuthProvider, UserProfile } from '@my-lex/shared-models';

import { AuthService } from '../auth/auth.service';
import { LoginHandler } from '../auth/features/login-handler/login-handler';

import { OAUTH_SETTINGS, OAuthSettings } from './oauth.constants';
import { OAuthService } from './oauth.service';

describe('OAuthService', () => {
  let oauthService: OAuthService;

  const mockGoogleOAuthUrl = 'google-oauth-auth-url';

  const mockGoogleProfile: UserProfile = {
    email: 'google@gmail.com',
    name: 'google-user',
    picture: '',
  };

  const googleOAuthProvilder: Partial<OAuthSettings['providers'][number]> = {
    name: 'google',
    getAuthUrl: () => mockGoogleOAuthUrl,
    appBaseUrl: 'app-base-url',
    getProfileInfoByCode: jest.fn(),
  };

  const mockOAuthSettings: Pick<OAuthSettings, 'appBaseUrl'> & {
    providers: Partial<OAuthSettings['providers'][number]>[];
  } = {
    appBaseUrl: 'app-base-url',
    providers: [googleOAuthProvilder],
  };

  const mockAuthService: Pick<AuthService, 'loginOrRegister'> = {
    loginOrRegister: jest.fn(),
  };

  const mockLoginHandler: LoginHandler = {
    persist: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OAUTH_SETTINGS,
          useValue: mockOAuthSettings,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        OAuthService,
      ],
    }).compile();

    oauthService = module.get(OAuthService);
  });

  it('should be defined', () => {
    expect(oauthService).toBeDefined();
  });

  it('getAuthUrl: should return auth url', () => {
    expect(oauthService.getAuthUrl('google')).toBe(mockGoogleOAuthUrl);
  });

  it('getAuthUrl: should throw an exception for unknown provider', () => {
    expect(() =>
      oauthService.getAuthUrl('__unknown-oauth-provider__' as OAuthProvider),
    ).toThrow(NotFoundException);
  });

  it('loginUserByCode: should throw an exception for unknown provider', async () => {
    await expect(
      oauthService.loginUserByCode(
        '__unknown-oauth-provider__' as OAuthProvider,
        '123456',
        mockLoginHandler,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('loginUserByCode: should throw an exception if user profile was not found', async () => {
    (googleOAuthProvilder.getProfileInfoByCode as jest.Mock).mockResolvedValue(
      null,
    );

    await expect(
      oauthService.loginUserByCode('google', '123456', mockLoginHandler),
    ).rejects.toThrow(NotFoundException);
  });

  it('loginUserByCode: should login', async () => {
    (googleOAuthProvilder.getProfileInfoByCode as jest.Mock).mockResolvedValue(
      mockGoogleProfile,
    );

    await oauthService.loginUserByCode('google', '123456', mockLoginHandler);

    expect(mockAuthService.loginOrRegister).toHaveBeenCalled();
  });
});
