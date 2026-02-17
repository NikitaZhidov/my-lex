import { FieldError } from 'react-hook-form';

import { VALIDATION_CONSTANTS } from '@my-lex/shared-models';

export type TranslationParams = Record<string, string | number>;

export const resolveFieldErrorTranslationParams = (
  fieldError?: FieldError,
): TranslationParams | undefined => {
  if (
    fieldError?.type === 'too_small' &&
    fieldError?.message?.includes('password')
  ) {
    return { length: VALIDATION_CONSTANTS.PASSWORD_MINIMUM };
  }

  return undefined;
};
