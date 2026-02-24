import { createParamDecorator } from '@nestjs/common';
import { type Request } from 'express';

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@my-lex/locales';

const validLocales: SupportedLanguage[] = SUPPORTED_LANGUAGES;

export const UserLocale = createParamDecorator((_, ctx): SupportedLanguage => {
  const request: Request = ctx.switchToHttp().getRequest();

  const cookies = request.cookies;
  const locale: SupportedLanguage = cookies['locale'];

  if (validLocales.includes(locale)) {
    return locale;
  }

  return 'en';
});
