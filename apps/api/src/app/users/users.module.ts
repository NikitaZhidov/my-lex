import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersMapper],
  exports: [UsersService],
})
export class UsersModule {}
