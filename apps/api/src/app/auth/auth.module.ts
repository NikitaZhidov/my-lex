import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginHandlerFactory } from './features/login-handler/login-handler';

@Module({
  providers: [AuthService, LoginHandlerFactory],
  controllers: [AuthController],
  exports: [AuthService, LoginHandlerFactory],
  imports: [UsersModule],
})
export class AuthModule {}
