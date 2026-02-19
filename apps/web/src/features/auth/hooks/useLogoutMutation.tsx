import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { authService } from '../services/auth.service';

import { APP_ROUTES } from '@/constants';
import { toastApiErrorHandler } from '@/shared/utils';

export const useLogoutMutation = () => {
  const t = useTranslations();
  const router = useRouter();

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => authService.logout(),
    onError: toastApiErrorHandler(t),
    onSuccess: () => router.push(APP_ROUTES.LOGIN),
  });

  return { logout, isLoading };
};
