import { flashcardsService } from '../services';

import { QUERY_KEYS } from '@/constants';
import { getQueryClient } from '@/shared/utils';

export const prefetchFlashcards = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.USER_FLASHCARDS],
    queryFn: () => flashcardsService.getAll().catch(err => console.error(err)),
  });

  return queryClient;
};
