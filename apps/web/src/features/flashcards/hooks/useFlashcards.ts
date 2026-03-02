import { useQuery } from '@tanstack/react-query';

import { flashcardsService } from '../services';

import { QUERY_KEYS } from '@/constants';

export const useFlashcards = () => {
  const { data: flashcards, isPending: isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER_FLASHCARDS],
    queryFn: () => flashcardsService.getAll(),
  });

  return { flashcards, isLoading };
};
