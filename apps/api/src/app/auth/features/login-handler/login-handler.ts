import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Request, type Response } from 'express';

import { UserProfile } from '@my-lex/shared-models';

export interface LoginHandler {
  persist(userId: UserProfile['id']): Promise<void>;
  clear(): Promise<void>;
}

class ExpressLoginHandler implements LoginHandler {
  constructor(
    private readonly configService: ConfigService,
    private readonly session: Request['session'],
    private readonly response: Response,
  ) {}

  async persist(userId: UserProfile['id']): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!userId) {
        return reject(
          new InternalServerErrorException(
            'Cannot save the session as userId has not been provided.',
          ),
        );
      }

      this.session.userId = userId;

      this.session.save(err => {
        if (err) {
          console.error(err);

          return reject(
            new InternalServerErrorException(
              'The session has not been saved. Please, check the settings of the session.',
            ),
          );
        }
      });

      resolve();
    });
  }

  async clear(): Promise<void> {
    const cookieOptions = this.session.cookie;

    return new Promise<void>((resolve, reject) => {
      this.session.destroy(err => {
        if (err) {
          console.error(err);

          return reject(
            new InternalServerErrorException(
              'The session has not been terminated. Something wrong with the server or the session has already been terminated.',
            ),
          );
        }
      });

      this.response.clearCookie(
        this.configService.getOrThrow<string>('SESSION_NAME'),
        {
          domain: cookieOptions.domain,
          path: cookieOptions.path,
        },
      );
      resolve();
    });
  }
}

@Injectable()
export class LoginHandlerFactory {
  constructor(private readonly configService: ConfigService) {}

  create(session: Request['session'], res: Response): LoginHandler {
    return new ExpressLoginHandler(this.configService, session, res);
  }
}
