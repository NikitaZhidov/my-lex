import { getRequestConfig } from 'next-intl/server';
import { SupportedLanguages, importTranslations } from '@my-lex/locales';

export default getRequestConfig(async () => {
  const locale: SupportedLanguages = 'ru';

  return {
    locale,
    messages: await importTranslations(locale),
  };
});
