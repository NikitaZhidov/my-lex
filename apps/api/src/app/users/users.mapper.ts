import { Injectable } from '@nestjs/common';

import { UserProfile } from '@my-lex/shared-models';

import { UserEntity } from './domain-entities/user-entity';

@Injectable()
export class UsersMapper {
  toUserProfileDto(user: UserEntity): UserProfile {
    return {
      email: user.email,
      name: user.name,
      id: user.id,
      picture: user.picture,
    };
  }
}
