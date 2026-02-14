import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Session,
} from '@nestjs/common';
import { type Request, type Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto, @Session() session: Request['session']) {
    return this.authService.loginByCredentials(loginDto, session);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Session() session: Request['session'],
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(session, response);
  }
}
