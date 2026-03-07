import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { getRecaptchaConfig } from '../../config/google-recaptcha-config';
import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginHandlerFactory } from './features/login-handler/login-handler';

@Module({
  imports: [
    UsersModule,
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LoginHandlerFactory],
  controllers: [AuthController],
  exports: [AuthService, LoginHandlerFactory],
})
export class AuthModule {}
