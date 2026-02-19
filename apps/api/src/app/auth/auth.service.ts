import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';

import { CreateUser, LoginUser, UserProfile } from '@my-lex/shared-models';

import { UsersRepository } from '../users/users.repository';

import { LoginHandler } from './features/login-handler/login-handler';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(
    createUserDto: Omit<CreateUser, 'passwordRepeat'>,
    picture?: UserProfile['picture'],
  ) {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('exceptions.userWithThatEmailAlreadyExists');
    }

    const passwordHash = createUserDto.password
      ? await hash(createUserDto.password)
      : '';

    await this.usersRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: passwordHash,
      picture: picture ?? undefined,
    });

    return true;
  }

  async loginByCredentials(loginUser: LoginUser, loginHandler: LoginHandler) {
    const user = await this.usersRepository.findByEmail(loginUser.email);

    if (!user) {
      throw new NotFoundException('exceptions.noUserWithThatEmail');
    }

    const isValidPassword =
      loginUser.password && user.password
        ? await verify(user.password, loginUser.password)
        : loginUser.password === user.password;

    if (!isValidPassword) {
      throw new UnauthorizedException('exceptions.incorrectPassword');
    }

    await loginHandler.persist(user.id);

    return true;
  }

  async loginOrRegister(
    userToLogin: Omit<UserProfile, 'id'>,
    loginHandler: LoginHandler,
  ) {
    const existingUser = await this.usersRepository.findByEmail(
      userToLogin.email,
    );

    if (existingUser) {
      await loginHandler.persist(existingUser.id);

      return true;
    }

    const createdUser = await this.usersRepository.create({
      email: userToLogin.email,
      name: userToLogin.name,
      password: '',
      picture: userToLogin.picture ?? undefined,
    });

    await loginHandler.persist(createdUser.id);

    return true;
  }

  async logout(loginHandler: LoginHandler) {
    await loginHandler.clear();

    return true;
  }
}
