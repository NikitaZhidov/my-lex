import { Injectable } from '@nestjs/common';

import { SupportedLanguage } from '@my-lex/locales';

import { EnLexicalPromptBuilder, RuLexicalPromptBuilder } from './builders';
import { LexicalPromptBuilder } from './types/lexical-prompt-builder';

@Injectable()
export class LexicalPromptBuilderFactory {
  private readonly constructors: Record<
    SupportedLanguage,
    new () => LexicalPromptBuilder
  > = {
    en: EnLexicalPromptBuilder,
    ru: RuLexicalPromptBuilder,
  };

  create(locale: SupportedLanguage) {
    return new (this.constructors[locale] ?? EnLexicalPromptBuilder)();
  }
}
