import { _Translator } from 'next-intl';

import { ApiError } from '@/lib';

export interface ParsedError {
  title?: string;
  errors?: string[];
}

export const parseApiErrorMessages = (
  t: _Translator,
  error: ApiError,
): ParsedError => {
  const title =
    error.message && !error.errors?.length ? t(error.message) : undefined;
  const errors = error.errors?.length
    ? error.errors.map(err => t(err.message, err.params))
    : undefined;

  return { title, errors };
};

export const parseAndSetError =
  (t: _Translator, setParsedError: (error: ParsedError) => void) =>
  (error: unknown) => {
    if (error instanceof ApiError) {
      setParsedError(parseApiErrorMessages(t, error));
    } else {
      setParsedError({ title: t('exceptions.somethingWentWrong') });
    }
  };
