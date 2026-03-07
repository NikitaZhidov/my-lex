import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Session,
} from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { type Request, type Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { LoginHandlerFactory } from './features/login-handler/login-handler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginHandlerFactory: LoginHandlerFactory,
  ) {}

  @Recaptcha()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Request['session'],
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.loginByCredentials(
      loginDto,
      this.loginHandlerFactory.create(session, res),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Session() session: Request['session'],
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(
      this.loginHandlerFactory.create(session, res),
    );
  }
}
