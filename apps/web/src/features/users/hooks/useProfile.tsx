import { useQuery } from '@tanstack/react-query';

import { usersService } from '../services/users.service';

import { QUERY_KEYS } from '@/constants';

export const useProfile = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: () => usersService.getMyProfile(),
  });

  return { profile, isLoading };
};
