import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@my-lex/locales';

import { STORAGE_KEYS } from '@/constants';

export const SUPPORTED_LOCALES: SupportedLanguage[] = SUPPORTED_LANGUAGES;

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

export const getAppLocaleFromCookies = (cookies: ReadonlyRequestCookies) => {
  const localeValue = cookies.get(STORAGE_KEYS.LOCALE)?.value;
  const locale: SupportedLanguage = isSupportedLocale(localeValue)
    ? localeValue
    : 'en';

  return locale;
};
