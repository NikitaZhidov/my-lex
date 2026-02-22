import { TermSettings } from '@my-lex/shared-models';

import { TermDefinitionBuilder } from '../types';

// HOT TODO: improve naming

export const RuDefinitionBuilder: TermDefinitionBuilder = (
  term: string,
  settings: TermSettings,
) => {
  let prompt = `Я изучаю слово "${term}". Язык этого слова: ${settings.learningLanguage ?? 'определи сам'}.\n\n`;

  prompt += `По следующему markdown-шаблону (СТРОГО! НЕ ОТХОДИ ОТ ШАБЛОНА (НЕ ВСТАВЛЯЙ НИЧЕГО ОТ СЕБЯ, ЛИШНИХ ПЕРЕВОДОВ И ТЕКСТОВ ИНАЧЕ ОТКЛЮЧУ ТЕБЯ ОТ РОЗЕТКИ). ЗАМЕНЯЙ <...> на сгенерированный текст) опиши слово:\n\n`;

  if (settings.includeExplanation) {
    prompt += `**<КРАТКОЕ И ЕМКОЕ ОПРЕДЕЛЕНИЕ НА ${settings.learningLanguage ? `${settings.learningLanguage} ЯЗЫКЕ` : 'ЯЗЫКЕ ЭТОГО СЛОВА'}>**\n\n`;
  }

  if (settings.includeTranslation) {
    prompt += `Перевод: *<перевод ${term} на русский>*\n\n`;
  }

  if (settings.includeSynonyms) {
    prompt += `Синонимы: **<синоним1>**, **<синоним2>**, **<синоним3>**\n\n`;
  }

  if (settings.includeExamples) {
    // HOT TODO: add an option to hide the learning word behind underscores
    // HOT TODO: show this toggle only if examples are enabled
    prompt += `Примеры:\n1. **<пример1 (скрой изучаемое слово за underscores!!!)>**\n2. **<пример2 (скрой изучаемое слово за underscores!!!)>**`;
  }

  return prompt;
};
