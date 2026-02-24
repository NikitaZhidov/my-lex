import { TermSettings } from '@my-lex/shared-models';

export interface LexicalPromptBuilder {
  getPromptForTerm(term: string, settings: TermSettings): string;
  getPromptForLongText(text: string, settings: TermSettings): string;
}
