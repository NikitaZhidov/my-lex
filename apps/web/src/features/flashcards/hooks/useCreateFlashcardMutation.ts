import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { Flashcard } from '@my-lex/shared-models';

import { flashcardsService } from '../services';

import { toastApiErrorHandler, toastSuccess } from '@/shared/utils';

export const useCreateFlashcardMutation = (
  term: string,
  definition: string,
) => {
  const t = useTranslations();

  const {
    mutate: create,
    isPending: isLoading,
    isSuccess: isCreated,
  } = useMutation({
    mutationKey: ['create-flashcard', term, definition],
    mutationFn: (card: Pick<Flashcard, 'term' | 'definition'>) =>
      flashcardsService.create(card),
    onError: toastApiErrorHandler(t),
    onSuccess: () => toastSuccess(t('flashcards.savedSuccessfully')),
  });

  return { create, isLoading, isCreated };
};
