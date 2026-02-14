import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Request, type Response } from 'express';

import { CreateUser, LoginUser, UserProfile } from '@my-lex/shared-models';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersSerivce: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    createUserDto: Omit<CreateUser, 'passwordRepeat'>,
    picture?: UserProfile['picture'],
  ) {
    return this.usersSerivce.create(createUserDto, picture ?? undefined);
  }

  async loginByCredentials(loginUser: LoginUser, session: Request['session']) {
    const user = await this.usersSerivce.getUserByCredentials(loginUser);

    await this.saveUserSession(user.id, session);
    return true;
  }

  async loginOrRegister(user: UserProfile, session: Request['session']) {
    const existingUser = await this.usersSerivce.findByEmail(user.email);

    if (existingUser) {
      await this.saveUserSession(existingUser.id, session);

      return existingUser;
    }

    const createdUser = await this.register(
      {
        email: user.email,
        name: user.name,
        password: '',
      },
      user.picture,
    );

    await this.saveUserSession(createdUser.id, session);

    return createdUser;
  }

  async logout(session: Request['session'], response: Response) {
    return new Promise<void>((resolve, reject) => {
      session.destroy(err => {
        if (err) {
          console.error(err);

          return reject(
            new InternalServerErrorException(
              'The session has not been terminated. Something wrong with the server or the session has already been terminated.',
            ),
          );
        }
      });

      response.clearCookie(
        this.configService.getOrThrow<string>('SESSION_NAME'),
      );
      resolve();
    });
  }

  private async saveUserSession(
    userId: UserProfile['id'],
    session: Request['session'],
  ) {
    return new Promise((resolve, reject) => {
      session.userId = userId;

      session.save(err => {
        if (err) {
          console.error(err);

          return reject(
            new InternalServerErrorException(
              'The session has not been saved. Please, check the settings of the session.',
            ),
          );
        }
      });

      resolve(userId);
    });
  }
}
