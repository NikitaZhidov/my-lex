import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserProfile } from '@my-lex/shared-models';

export const Authorized = createParamDecorator(
  (key: keyof UserProfile, ctx: ExecutionContext) => {
    const request: Request & { user: UserProfile } = ctx
      .switchToHttp()
      .getRequest();

    return key ? request.user[key] : request.user;
  },
);
