import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { Flashcard } from '@my-lex/shared-models';

import { flashcardsService } from '../services';

import { QUERY_KEYS } from '@/constants';
import { toastApiErrorHandler, toastSuccess } from '@/shared/utils';

const FLASHCARDS_QUERY_KEY = [QUERY_KEYS.USER_FLASHCARDS];

const TEMPORARY_OPTIMISTIC_ID = '__temporary-optimistic-id__';

type FlashcardMutationParams = {
  onSuccess?: (card: Flashcard) => void;
  showSuccessMessage?: boolean;
};

export const useSaveFlashcardMutation = (params?: FlashcardMutationParams) => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const { mutate: save, isPending: isLoading } = useMutation({
    mutationKey: ['save-flashcard'],
    mutationFn: (card: Pick<Flashcard, 'term' | 'definition' | 'id'>) => {
      return flashcardsService.save(card);
    },
    onMutate: async card => {
      await queryClient.cancelQueries({
        queryKey: FLASHCARDS_QUERY_KEY,
      });

      const prevCards =
        queryClient.getQueryData<Flashcard[]>(FLASHCARDS_QUERY_KEY);

      // CREATE
      if (!card.id) {
        const optimisticId = TEMPORARY_OPTIMISTIC_ID;

        const optimisticCard: Flashcard = {
          ...card,
          createdAt: new Date(),
          id: optimisticId,
        } as Flashcard;

        queryClient.setQueryData<Flashcard[]>(FLASHCARDS_QUERY_KEY, current => [
          optimisticCard,
          ...(current ?? []),
        ]);

        return { prevCards, optimisticId };
      }

      // UPDATE
      queryClient.setQueryData<Flashcard[]>(FLASHCARDS_QUERY_KEY, current =>
        (current ?? []).map(existing =>
          existing.id === card.id ? { ...existing, ...card } : existing,
        ),
      );

      return { prevCards };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData<Flashcard[]>(
        FLASHCARDS_QUERY_KEY,
        context?.prevCards,
      );

      toastApiErrorHandler(t)(error);
    },

    onSuccess: (serverCard, _, context) => {
      queryClient.setQueryData<Flashcard[]>(FLASHCARDS_QUERY_KEY, current => {
        if (!current) return [serverCard];

        if (context?.optimisticId) {
          return current.map(card =>
            card.id === context.optimisticId ? serverCard : card,
          );
        }

        return current.map(card =>
          card.id === serverCard.id ? serverCard : card,
        );
      });

      if (params?.showSuccessMessage ?? true) {
        toastSuccess(t('flashcards.savedSuccessfully'));
      }

      params?.onSuccess?.(serverCard);
    },
  });

  return { save, isLoading };
};
