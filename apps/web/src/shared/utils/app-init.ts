import { getQueryClient } from '.';

import { QUERY_KEYS } from '@/constants';
import { usersService } from '@/features/users/services/users.service';

export const prefetchAppData = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: () => usersService.getMyProfile().catch(err => console.error(err)),
  });

  return queryClient;
};
