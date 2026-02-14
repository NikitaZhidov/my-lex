import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { OAUTH_SETTINGS } from './oauth.constants';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';

export type OAuthModuleAsyncOptions = Pick<
  FactoryProvider,
  'inject' | 'useFactory'
> &
  Pick<ModuleMetadata, 'imports'>;

@Module({})
export class OAuthModule {
  static registerAsync(options: OAuthModuleAsyncOptions): DynamicModule {
    return {
      module: OAuthModule,
      controllers: [OAuthController],
      imports: [AuthModule, ...(options.imports ?? [])],
      providers: [
        {
          provide: OAUTH_SETTINGS,
          inject: options.inject,
          useFactory: options.useFactory,
        },
        OAuthService,
      ],
    };
  }
}
