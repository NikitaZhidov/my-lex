'use client';

import { useMemo } from 'react';

import { useFlashcards } from '../hooks/useFlashcards';
import { FlashcardsSet } from '../ui';

import { sortByCreatedAt } from '@/shared/utils/sort.utils';

export const UserFlashcards = () => {
  const { flashcards } = useFlashcards();

  if (!flashcards) {
    return <></>;
  }

  const sortedFlashcards = useMemo(
    () => [...flashcards].sort(sortByCreatedAt),
    [flashcards],
  );

  return <FlashcardsSet flashcards={sortedFlashcards} />;
};
