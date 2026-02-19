import { SupportedLanguage } from '@my-lex/locales';

export const SUPPORTED_LOCALES: SupportedLanguage[] = ['en', 'ru'];

export const isSupportedLocale = (val?: string): val is SupportedLanguage => {
  if (!val) {
    return false;
  }

  if (SUPPORTED_LOCALES.includes(val as SupportedLanguage)) {
    return true;
  }

  return false;
};

const LOCALE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  ru: 'Русский',
};

export const getLocaleLabel = (locale: string) => {
  if (isSupportedLocale(locale)) {
    return LOCALE_LABELS[locale];
  }

  return 'Unknown';
};
