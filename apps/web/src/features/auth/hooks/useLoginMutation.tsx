import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { LoginUser } from '@my-lex/shared-models';

import { authService } from '../services/auth.service';

import { ApiError } from '@/lib';

export function useLoginMutation() {
  const t = useTranslations();

  const { mutate: login, isPending: isLoginLoading } = useMutation({
    mutationKey: ['login'],
    mutationFn: (loginInfo: LoginUser) => authService.login(loginInfo),
    onError(error: ApiError) {
      // HOT TODO: remove
      console.log(`is api error`, error instanceof ApiError);

      // HOT TODO: handle the error message (add an utility function)
      console.log(
        error instanceof ApiError
          ? t(error.message)
          : t('exceptions.somethingWentWrong'),
      );
      console.log(
        (error.errors ?? []).map(err => t(err.message, err.params)).join(', '),
      );
    },
    onSuccess(res) {
      // HOT TODO: redirect
      console.log(res);
    },
  });

  return { login, isLoginLoading };
}
