import { Injectable } from '@nestjs/common';

import { UserProfile } from '@my-lex/shared-models';

import { User } from '../../generated/prisma/client';

@Injectable()
export class UsersMapper {
  toUserProfile(user: User): UserProfile {
    return {
      email: user.email,
      name: user.displayName,
      id: user.id,
      picture: user.picture,
    };
  }
}
