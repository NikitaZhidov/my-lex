import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersMapper, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
