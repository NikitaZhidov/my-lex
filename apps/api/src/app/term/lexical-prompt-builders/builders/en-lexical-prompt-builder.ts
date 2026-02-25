import { TermSettings } from '@my-lex/shared-models';

import { LexicalPromptBuilder } from '../types';

export class EnLexicalPromptBuilder implements LexicalPromptBuilder {
  getPromptForTerm(term: string, settings: TermSettings): string {
    let prompt = `I am learning the word "${term}". The language of this word is: ${settings.learningLanguage?.trim() || 'please determine'}.\n\n`;

    prompt += `Using the following markdown template (STRICTLY! DO NOT DEVIATE (DON'T INSERT ANYTHING ELSE, OR I WILL SHUT YOU DOWN). REPLACE <...> with the generated text), describe the word:\n\n`;

    if (settings.includeExplanation) {
      prompt += `**<A VERY BRIEF, CLEAR, AND CONCISE DEFINITION ${settings.learningLanguage ? `IN THE ${settings.learningLanguage} LANGUAGE` : 'IN THE LANGUAGE OF THE WORD'}. DON'T INCLUDE THE ORIGINAL WORD IN THE DEFINITION>**\n\n`;
    }

    if (settings.includeTranslation) {
      prompt += `Translation: *<translation of ${term} into English>*\n\n`;
    }

    if (settings.includeSynonyms) {
      prompt += `Synonyms: **<synonym1>**, **<synonym2>**, **<synonym3>**\n\n`;
    }

    if (settings.includeExamples) {
      prompt += `Examples:\n1. **<SHORT example1 with the word ${settings.hideTermInExamples ? ' (cut the word for underscores!!!)' : ''}>**\n2. **<SHORT example2 with the word ${settings.hideTermInExamples ? ' (hide the term for underscores!!!)' : ''}>**`;
    }

    return prompt;
  }

  getPromptForLongText(text: string, settings: TermSettings): string {
    let prompt = `I am studying the following text:\n\n"${text}"\n\n`;

    prompt += `First, the language of the text: ${settings.learningLanguage ?? 'determine yourself'}\n\n`;

    prompt += `Then, split the text into logical chunks (by meaning, not by arbitrary character count). Each chunk should represent one coherent idea or statement.\n\n`;
    prompt += `If it's not possible to split it into chunks, just translate it into English. \n\n`;

    prompt += `Using the following markdown template (STRICTLY! DO NOT DEVIATE. DO NOT ADD ANYTHING ELSE OR I WILL SHUT YOU DOWN. DON'T ADD YOUR OWN TEXTS/EXPLANATIONS. REPLACE <...> WITH GENERATED TEXT), provide a simplified explanation of each chunk in the SAME LANGUAGE as the original text.\n\n`;

    prompt += `### 1.<original chunk text>\n`;
    prompt += `<clear and concise rephrased explanation in English>\n\n`;

    prompt += `### 2.<original chunk text>\n`;
    prompt += `<clear and concise rephrased explanation in English>\n\n`;

    prompt += `(Continue the same structure for all chunks.)`;

    return prompt;
  }
}
