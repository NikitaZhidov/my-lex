import { SupportedLanguage } from './supported-language';

export const importTranslations = async (lang: SupportedLanguage) => {
  return (await import(`./${lang}.json`)).default;
};
