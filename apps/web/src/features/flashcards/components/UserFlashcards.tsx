'use client';

import { useFlashcards } from '../hooks/useFlashcards';
import { FlashcardsSet } from '../ui';

export const UserFlashcards = () => {
  const { flashcards } = useFlashcards();

  if (!flashcards) {
    return <>Loading...</>;
  }

  return <FlashcardsSet flashcards={flashcards} />;
};
