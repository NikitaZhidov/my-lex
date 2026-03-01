import { useMemo } from 'react';

import { Button, Card } from '@my-lex/ui';

import { useFlashcardsLearningCarouselStore } from '../hooks/useFlashcardsLearningCarouselStore';

import { cn } from '@/shared/utils';

export interface FlashcardsLearningCarouselResultsOverviewProps {
  className?: string;
}

export const FlashcardsLearningCarouselResultsOverview = ({
  className,
}: FlashcardsLearningCarouselResultsOverviewProps) => {
  const { state, dispatch, flashcards } = useFlashcardsLearningCarouselStore();

  const restartFlashcards = () => dispatch({ type: 'RESTART' });
  const restartOnlyLearning = () =>
    dispatch({ type: 'RESTART', onlyLearning: true });

  const stillLearningFlashcards = useMemo(
    () => flashcards.filter(card => state.stillLearningIds.includes(card.id)),
    [flashcards, state.stillLearningIds],
  );

  // HOT TODO: add translations
  // HOT TODO: make it more friendly and pretty
  return (
    <Card
      className={cn(
        'flex flex-col w-full items-center justify-center gap-4',
        className,
      )}
    >
      <div>Done</div>
      <Button onClick={restartFlashcards}>Restart flashcards</Button>
      {stillLearningFlashcards.length > 0 && (
        <Button className='text-warning' onClick={restartOnlyLearning}>
          Restart learning ({stillLearningFlashcards.length})
        </Button>
      )}
    </Card>
  );
};
