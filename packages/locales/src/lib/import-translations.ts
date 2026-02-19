import { SupportedLanguage } from './supported-languages';

export const importTranslations = async (lang: SupportedLanguage) => {
  return (await import(`./${lang}.json`)).default;
};
