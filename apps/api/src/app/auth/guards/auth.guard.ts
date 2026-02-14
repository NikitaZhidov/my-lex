import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request } from 'express';

import { UserProfile } from '@my-lex/shared-models';

import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    const userId = request.session.userId;

    if (typeof userId === 'undefined') {
      throw new UnauthorizedException('exceptions.unauthorizedUser');
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('exceptions.userNotFound');
    }

    (request as Request & { user: UserProfile }).user = user;

    return true;
  }
}
