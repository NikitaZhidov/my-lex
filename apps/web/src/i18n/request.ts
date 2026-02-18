import { getRequestConfig } from 'next-intl/server';

import { importTranslations, SupportedLanguages } from '@my-lex/locales';

export default getRequestConfig(async () => {
  const locale: SupportedLanguages = 'en';

  return {
    locale,
    messages: await importTranslations(locale),
  };
});
