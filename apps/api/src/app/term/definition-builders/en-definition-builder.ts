import { TermSettings } from '@my-lex/shared-models';

import { TermDefinitionBuilder } from '../types';

export const EnDefinitionBuilder: TermDefinitionBuilder = (
  term: string,
  settings: TermSettings,
) => {
  let prompt = `I am learning the word "${term}". The language of this word is: ${settings.learningLanguage ?? 'please determine'}.\n\n`;

  prompt += `Using the following markdown template (STRICTLY! DO NOT DEVIATE (DON'T INSERT ANYTHING ELSE, OR I WILL SHUT YOU DOWN). REPLACE <...> with the generated text), describe the word:\n\n`;

  if (settings.includeExplanation) {
    prompt += `**<A VERY BRIEF, CLEAR, AND CONCISE DEFINITION ${settings.learningLanguage ? `IN THE ${settings.learningLanguage} LANGUAGE` : 'IN THE LANGUAGE OF THE WORD'}>>**\n\n`;
  }

  if (settings.includeTranslation) {
    prompt += `Translation: *<translation of ${term} into English>*\n\n`;
  }

  if (settings.includeSynonyms) {
    prompt += `Synonyms: **<synonym1>**, **<synonym2>**, **<synonym3>**\n\n`;
  }

  if (settings.includeExamples) {
    prompt += `Examples:\n1. **<example1>**\n2. **<example2>**`;
  }

  return prompt;
};
