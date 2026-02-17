import { useTranslations } from 'next-intl';
import { ControllerFieldState } from 'react-hook-form';

import { FieldError } from '@my-lex/ui';

import { resolveFieldErrorTranslationParams } from '../utils/resolve-translation-params';

export interface FormFieldErrorProps {
  fieldState: ControllerFieldState;
}

const FormFieldError = ({ fieldState }: FormFieldErrorProps) => {
  const t = useTranslations();

  if (!fieldState.invalid) {
    return <></>;
  }

  const translationKey = fieldState.error?.message;

  if (!translationKey) {
    return <></>;
  }

  return (
    <FieldError
      errors={[
        {
          message: t(
            translationKey,
            resolveFieldErrorTranslationParams(fieldState.error),
          ),
        },
      ]}
    />
  );
};

export default FormFieldError;
