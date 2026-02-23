import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SupportedLanguage } from '@my-lex/locales';
import { TermSettings as TermDefinitionSettings } from '@my-lex/shared-models';

import { LLMService } from '../llm/llm.service';

import {
  EnDefinitionBuilder,
  RuDefinitionBuilder,
  RuLongTextExplanationBuilder,
} from './definition-builders';
import { TermDefinitionBuilder } from './types/term-definition-builder';

const promptForLocale: Record<SupportedLanguage, TermDefinitionBuilder> = {
  en: EnDefinitionBuilder,
  ru: RuDefinitionBuilder,
};

function isShortExpression(text: string): boolean {
  const trimmed = text.trim();

  if (trimmed.length > 120) return false;

  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount > 6) return false;

  return true;
}

const DEFINITION_PROMPT = (
  term: string,
  locale: SupportedLanguage,
  settings: TermDefinitionSettings,
) => {
  const prompt = (promptForLocale[locale] ?? promptForLocale.en)(
    term,
    settings,
  );

  if (isShortExpression(term)) {
    return prompt;
  } else {
    return RuLongTextExplanationBuilder(term, settings);
  }

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
    // HOT TODO: create a more clear solution (a separate provider for prompts)

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
