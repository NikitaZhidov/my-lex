import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CreateUser } from '@my-lex/shared-models';

import { authService } from '../services/auth.service';

import { APP_ROUTES } from '@/constants';
import { parseAndSetError, ParsedError, toastSuccess } from '@/shared/utils';

export const useRegisterMutation = () => {
  const t = useTranslations();
  const router = useRouter();

  const [parsedError, setParsedError] = useState<ParsedError | undefined>(
    undefined,
  );

  const { mutate: register, isPending: isRegisterLoading } = useMutation({
    mutationKey: ['register'],
    mutationFn: (registerInfo: CreateUser & { recaptcha?: string }) =>
      authService.register(
        {
          email: registerInfo.email,
          password: registerInfo.password,
          passwordRepeat: registerInfo.passwordRepeat,
          name: registerInfo.name,
        },
        registerInfo.recaptcha,
      ),
    onMutate: () => setParsedError(undefined),
    onSuccess() {
      toastSuccess(t('auth.registrationWasSuccessful'));
      router.push(APP_ROUTES.LOGIN);
    },
    onError: parseAndSetError(t, setParsedError),
  });

  return { register, isRegisterLoading, parsedError };
};
