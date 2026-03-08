import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodSerializerInterceptor } from 'nestjs-zod';

import { OAuthProviderConfigFactory } from '../config/oauth-providers.config';
import { appThrottlerConfig } from '../config/throttler-config';
import { IS_DEV_ENV } from '../libs/common/utils/is-dev.utils';

import { AuthModule } from './auth/auth.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { LoggerModule } from './logger/logger.module';
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: appThrottlerConfig,
    }),
    PrismaModule,
    LoggerModule,
    UsersModule,
    AuthModule,
    TermsModule,
    FlashcardsModule,
  ],
})
export class AppModule {}
