import { Injectable } from '@nestjs/common';

import { UserProfile } from '@my-lex/shared-models';

import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersMapper: UsersMapper,
    private readonly usersRepostiory: UsersRepository,
  ) {}

  async findById(id: UserProfile['id']) {
    if (!id) {
      return null;
    }

    const user = await this.usersRepostiory.findById(id);

    return user ? this.usersMapper.toUserProfileDto(user) : null;
  }
}
