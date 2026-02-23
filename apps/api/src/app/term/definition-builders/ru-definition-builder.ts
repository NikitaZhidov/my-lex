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
    prompt += `**<КРАТКОЕ И ЕМКОЕ ОПРЕДЕЛЕНИЕ НА ${settings.learningLanguage ? `${settings.learningLanguage} ЯЗЫКЕ` : 'ЯЗЫКЕ ЭТОГО СЛОВА'}. НЕ ВКЛЮЧАЙ ОРИГИНАЛЬНОЕ СЛОВО В ОПРЕДЕЛЕНИЕ>**\n\n`;
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

export const RuLongTextExplanationBuilder: TermDefinitionBuilder = (
  text: string,
  settings: TermSettings,
) => {
  let prompt = `Я изучаю следующий текст:\n\n"${text}"\n\n`;

  prompt += `Сначала укажи язык текста: ${settings.learningLanguage ?? 'определи самостоятельно'}\n\n`;

  prompt += `Затем раздели текст на логические части (по смыслу, а не по произвольному количеству символов). Каждая часть должна представлять одну завершённую мысль или утверждение.\n\n`;

  prompt += `Используя следующий шаблон markdown (СТРОГО! НЕ ОТКЛОНЯЙСЯ. НИЧЕГО НЕ ДОБАВЛЯЙ. ЗАМЕНИ <...> НА СГЕНЕРИРОВАННЫЙ ТЕКСТ), предоставь упрощённое объяснение каждой части НА ТОМ ЖЕ ЯЗЫКЕ, что и исходный текст.\n\n`;

  prompt += `### 1.<оригинальный фрагмент текста>\n`;
  prompt += `<понятное и краткое переформулированное объяснение на русском>\n\n`;

  prompt += `### 2.<оригинальный фрагмент текста>\n`;
  prompt += `<понятное и краткое переформулированное объяснение на русском>\n\n`;

  prompt += `(Продолжай ту же структуру для всех частей.)`;

  return prompt;
};
