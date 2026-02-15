import { Injectable } from '@nestjs/common';

import { User } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { UserEntity } from './domain-entities/user-entity';

export interface CreateUserEntity {
  name: string;
  email: string;
  picture?: string;
  password: string;
}

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findFirst({ where: { email } });

    return user ? this.toUserEntity(user) : null;
  }

  async findById(id: UserEntity['id']): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findFirst({ where: { id } });

    return user ? this.toUserEntity(user) : null;
  }

  async create(createUserData: CreateUserEntity) {
    const user = await this.prismaService.user.create({
      data: {
        displayName: createUserData.name,
        email: createUserData.email,
        picture: createUserData.picture,
        password: createUserData.password,
      },
    });

    return this.toUserEntity(user);
  }

  private toUserEntity(user: User): UserEntity {
    return {
      id: user.id,
      email: user.email,
      name: user.displayName,
      password: user.password,
      picture: user.picture,
    };
  }
}
