import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SupportedLanguage } from '@my-lex/locales';
import { TermSettings as TermDefinitionSettings } from '@my-lex/shared-models';

import { LLMService } from '../llm/llm.service';

import {
  EnDefinitionBuilder,
  RuDefinitionBuilder,
} from './definition-builders';
import { TermDefinitionBuilder } from './types/term-definition-builder';

const promptForLocale: Record<SupportedLanguage, TermDefinitionBuilder> = {
  en: EnDefinitionBuilder,
  ru: RuDefinitionBuilder,
};

const DEFINITION_PROMPT = (
  term: string,
  locale: SupportedLanguage,
  settings: TermDefinitionSettings,
) => {
  const prompt = (promptForLocale[locale] ?? promptForLocale.en)(
    term,
    settings,
  );

  return prompt;
};

@Injectable()
export class TermsService {
  constructor(private readonly llm: LLMService) {}

  getTermStreamDefinition(
    term: string,
    locale: SupportedLanguage,
    settings?: TermDefinitionSettings,
  ): Observable<string> {
    // HOT TODO: wrap the term with a prompt here

    return new Observable(obs => {
      const controller = new AbortController();

      obs.add(() => controller.abort());

      (async () => {
        try {
          for await (const chunk of this.llm.streamResponse(
            DEFINITION_PROMPT(term, locale, settings ?? {}),
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
}
