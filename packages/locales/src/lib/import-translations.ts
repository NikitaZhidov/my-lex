import { SupportedLanguages } from './supported-languages';

export const importTranslations = async (lang: SupportedLanguages) => {
  return (await import(`./${lang}.json`)).default;
};
