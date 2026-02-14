import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';

import { CreateUser, LoginUser, UserProfile } from '@my-lex/shared-models';

import { User } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { UsersMapper } from './users.mapper';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersMapper: UsersMapper,
  ) {}

  async create(
    createUserDto: Omit<CreateUser, 'passwordRepeat'>,
    picture?: string,
  ) {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('exceptions.userWithThatEmailAlreadyExists');
    }

    const password = createUserDto.password
      ? await hash(createUserDto.password)
      : '';

    const user = await this.prismaService.user.create({
      data: {
        displayName: createUserDto.name,
        email: createUserDto.email,
        picture,
        password,
      },
    });

    return this.usersMapper.toUserProfile(user);
  }

  async getUserByCredentials(credentials: LoginUser) {
    const user = await this.prismaService.user.findFirst({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new NotFoundException('exceptions.noUserWithThatEmail');
    }

    const isValidPassword = await verify(user.password, credentials.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('exceptions.incorrectPassword');
    }

    return this.usersMapper.toUserProfile(user);
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    const user = await this.prismaService.user.findFirst({ where: { email } });

    return user ? this.usersMapper.toUserProfile(user) : null;
  }

  async findById(id: User['id']): Promise<UserProfile | null> {
    const user = await this.prismaService.user.findFirst({ where: { id } });

    return user ? this.usersMapper.toUserProfile(user) : null;
  }
}
