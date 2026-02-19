import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

import { importTranslations } from '@my-lex/locales';

import { getAppLocaleFromCookies } from '@/shared/utils';

export default getRequestConfig(async () => {
  const locale = getAppLocaleFromCookies(await cookies());

  return {
    locale,
    messages: await importTranslations(locale),
  };
});
