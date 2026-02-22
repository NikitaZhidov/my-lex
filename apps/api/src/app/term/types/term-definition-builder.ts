import { TermSettings } from '@my-lex/shared-models';

export type TermDefinitionBuilder = (
  term: string,
  settings: TermSettings,
) => string;
