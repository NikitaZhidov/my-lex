import { createParamDecorator } from '@nestjs/common';
import { type Request } from 'express';

import { TermSettings } from '@my-lex/shared-models';

export const TermSettingsValue = createParamDecorator(
  (_, ctx): TermSettings => {
    const request: Request = ctx.switchToHttp().getRequest();

    const queryParams = request.query as Record<keyof TermSettings, string>;

    return {
      includeExamples: queryParams.includeExamples === 'true',
      includeExplanation: queryParams.includeExplanation === 'true',
      includeSynonyms: queryParams.includeSynonyms === 'true',
      includeTranslation: queryParams.includeTranslation === 'true',
      learningLanguage: queryParams.learningLanguage,
    };
  },
);
