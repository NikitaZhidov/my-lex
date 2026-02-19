import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

import { importTranslations, SupportedLanguage } from '@my-lex/locales';

import { isSupportedLocale } from '@/shared/utils';

export default getRequestConfig(async () => {
  const store = await cookies();
  const localeValue = store.get('locale')?.value;
  const locale: SupportedLanguage = isSupportedLocale(localeValue)
    ? localeValue
    : 'en';

  return {
    locale,
    messages: await importTranslations(locale),
  };
});
