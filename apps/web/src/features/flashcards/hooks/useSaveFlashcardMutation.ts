import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { Flashcard } from '@my-lex/shared-models';

import { flashcardsService } from '../services';

import { toastApiErrorHandler, toastSuccess } from '@/shared/utils';

export const useSaveFlashcardMutation = (
  term: string,
  definition: string,
  onSuccess?: (card: Flashcard) => void,
) => {
  const t = useTranslations();

  const {
    mutate: save,
    isPending: isLoading,
    isSuccess: isCreated,
  } = useMutation({
    mutationKey: ['save-flashcard', term, definition],
    mutationFn: (card: Pick<Flashcard, 'term' | 'definition' | 'id'>) =>
      flashcardsService.save(card),
    onError: toastApiErrorHandler(t),
    onSuccess: card => {
      onSuccess?.(card);
      toastSuccess(t('flashcards.savedSuccessfully'));
    },
  });

  return { save, isLoading, isCreated };
};
