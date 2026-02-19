import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { LoginUser, OAuthProvider } from '@my-lex/shared-models';

import { authService } from '../services/auth.service';

import { HOME_ROUTE } from '@/constants';
import {
  parseAndSetError,
  ParsedError,
  toastApiErrorHandler,
} from '@/shared/utils';

export function useLoginMutation() {
  const t = useTranslations();
  const router = useRouter();

  const [parsedError, setParsedError] = useState<ParsedError | undefined>(
    undefined,
  );

  const { mutate: login, isPending: isLoginLoading } = useMutation({
    mutationKey: ['login'],
    mutationFn: (loginInfo: LoginUser) => authService.login(loginInfo),
    onMutate: () => setParsedError(undefined),
    onError: parseAndSetError(t, setParsedError),
    onSuccess: () => router.push(HOME_ROUTE),
  });

  return { login, isLoginLoading, parsedError };
}

export function useLoginWithProvider() {
  const t = useTranslations();
  const router = useRouter();

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationKey: ['login-with-provider'],
    mutationFn: (provider: OAuthProvider) =>
      authService.getProviderAuthUrl(provider).then(res => res.authUrl),
    onError: toastApiErrorHandler(t),
    onSuccess(authUrl: string) {
      router.push(authUrl);
    },
  });

  return { login, isLoading };
}
