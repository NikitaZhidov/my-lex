import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor } from 'nestjs-zod';

import { OAuthProviderConfigFactory } from '../config/oauth-providers.config';
import { IS_DEV_ENV } from '../libs/common/utils/is-dev.utils';

import { AuthModule } from './auth/auth.module';
import { OAuthModule } from './oauth/oauth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TermsModule } from './term/terms.module';
import { UsersModule } from './users/users.module';
import { CustomZodValidationPipe } from './validation/zod-validation.pipe';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV,
    }),
    OAuthModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: OAuthProviderConfigFactory,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    TermsModule,
  ],
})
export class AppModule {}
