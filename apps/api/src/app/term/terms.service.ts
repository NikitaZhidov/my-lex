import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SupportedLanguage } from '@my-lex/locales';
import { TermSettings } from '@my-lex/shared-models';

import { LLMService } from '../llm/llm.service';

import { LexicalPromptBuilderFactory } from './lexical-prompt-builders';

@Injectable()
export class TermsService {
  constructor(
    private readonly llm: LLMService,
    private readonly promptBuilderFactory: LexicalPromptBuilderFactory,
  ) {}

  getTermStreamDefinition(
    term: string,
    locale: SupportedLanguage,
    settings: TermSettings = {},
  ): Observable<string> {
    term = this.clearTerm(term);

    const promptBuilder = this.promptBuilderFactory.create(locale);
    const prompt = this.isShortExpression(term)
      ? promptBuilder.getPromptForTerm(term, settings)
      : promptBuilder.getPromptForLongText(term, settings);

    return new Observable(obs => {
      const controller = new AbortController();

      obs.add(() => controller.abort());

      (async () => {
        try {
          for await (const chunk of this.llm.streamResponse(
            prompt,
            controller.signal,
          )) {
            obs.next(chunk);
          }

          obs.complete();
        } catch (err) {
          console.error(err);
          obs.complete();
        }
      })();
    });
  }

  private clearTerm(term: string): string {
    return term.trim();
  }

  private isShortExpression(text: string): boolean {
    const trimmed = text.trim();

    if (trimmed.length > 120) return false;

    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount > 6) return false;

    return true;
  }
}
