import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { Flashcard } from '@my-lex/shared-models';

import { flashcardsService } from '../services';

import { QUERY_KEYS } from '@/constants';
import { toastApiErrorHandler } from '@/shared/utils';

const FLASHCARDS_QUERY_KEY = [QUERY_KEYS.USER_FLASHCARDS];

export const useDeleteFlashcardMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const { mutate: deleteCard, isPending: isLoading } = useMutation({
    mutationKey: ['delete-flashcard'],
    mutationFn: (cardId: Flashcard['id']) => flashcardsService.delete(cardId),

    onError: toastApiErrorHandler(t),

    onSuccess: (_, cardId) => {
      queryClient.setQueryData<Flashcard[]>(FLASHCARDS_QUERY_KEY, current =>
        (current ?? []).filter(existing => existing.id !== cardId),
      );
    },
  });

  return { deleteCard, isLoading };
};
