import { Controller, Get, UseGuards } from '@nestjs/common';

import { type UserProfile } from '@my-lex/shared-models';

import { Authorized } from '../auth/decorators/authorized.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Authorized() user: UserProfile) {
    return user;
  }
}
