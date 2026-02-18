import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { LoginUser } from '@my-lex/shared-models';

import { authService } from '../services/auth.service';

import { parseAndSetError, ParsedError } from '@/shared/utils';

export function useLoginMutation() {
  const t = useTranslations();

  const [parsedError, setParsedError] = useState<ParsedError | undefined>(
    undefined,
  );

  const { mutate: login, isPending: isLoginLoading } = useMutation({
    mutationKey: ['login'],
    mutationFn: (loginInfo: LoginUser) => authService.login(loginInfo),
    onMutate: () => setParsedError(undefined),
    onError: parseAndSetError(t, setParsedError),
    onSuccess(res) {
      // HOT TODO: redirect
      console.log(res);
    },
  });

  return { login, isLoginLoading, parsedError };
}
