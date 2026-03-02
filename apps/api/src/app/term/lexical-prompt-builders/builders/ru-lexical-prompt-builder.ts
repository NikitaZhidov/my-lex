import { TermSettings } from '@my-lex/shared-models';

import { LexicalPromptBuilder } from '../types';

export class RuLexicalPromptBuilder implements LexicalPromptBuilder {
  getPromptForTerm(term: string, settings: TermSettings): string {
    let prompt = `Я изучаю слово "${term}". Язык этого слова: ${settings.learningLanguage?.trim() || 'определи сам'}.\n\n`;

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
      prompt += `Примеры:\n1. **<КРАТКИЙ пример1${settings.hideTermInExamples ? ' (скрой изучаемое слово за underscores!!!)' : ''}>**\n2. **<КРАТКИЙ пример2${settings.hideTermInExamples ? ' (скрой изучаемое слово за underscores!!!)' : ''}>**`;
    }

    return prompt;
  }

  getPromptForLongText(text: string, settings: TermSettings): string {
    let prompt = `Я изучаю следующий текст:\n\n"${text}"\n\n`;

    prompt += `Язык текста: ${settings.learningLanguage ?? 'определи самостоятельно'}\n\n`;

    prompt += `Затем раздели текст на логические части (по смыслу, а не по произвольному количеству символов). Каждая часть должна представлять одну завершённую мысль или утверждение. Старайся делать каждую часть короткой.\n\n`;
    prompt += `Если невозможно разделить текст на логические части, просто переведи его. \n\n`;

    prompt += `Используя следующий шаблон markdown (СТРОГО! НЕ ОТКЛОНЯЙСЯ, НИЧЕГО НЕ ДОБАВЛЯЙ, НИЧЕГО БОЛЬШЕ НЕ ПИШИ ОТ СЕБЯ, ИНАЧЕ ОТКЛЮЧУ ОТ РОЗЕТКИ. ЗАМЕНИ <...> НА СГЕНЕРИРОВАННЫЙ ТЕКСТ), предоставь упрощённое объяснение каждой части на русском.\n\n`;

    prompt += `### 1.<оригинальный фрагмент текста>\n`;
    prompt += `<понятное и краткое переформулированное объяснение на русском>\n\n`;

    prompt += `### 2.<оригинальный фрагмент текста>\n`;
    prompt += `<понятное и краткое переформулированное объяснение на русском>\n\n`;

    prompt += `(Продолжай ту же структуру для всех частей.)`;

    return prompt;
  }
}
