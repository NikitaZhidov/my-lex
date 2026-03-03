import { getQueryClient } from '.';

import { APP_ROUTES, QUERY_KEYS } from '@/constants';
import { usersService } from '@/features/users/services/users.service';
import { ApiError } from '@/lib/api/api-error';
import { redirect } from 'next/navigation';

export const prefetchAppData = async () => {
  const queryClient = getQueryClient();

  const profile = await usersService.getMyProfile().catch(err => {
    if (err instanceof ApiError && err.statusCode === 401) {
      redirect(APP_ROUTES.LOGOUT);
    }

    return null;
  });

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: async () => new Promise((resolve) => resolve(profile)),
  });

  return queryClient;
};
