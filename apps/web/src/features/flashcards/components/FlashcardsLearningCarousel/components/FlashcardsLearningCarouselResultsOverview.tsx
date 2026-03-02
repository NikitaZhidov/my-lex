import { PartyPopper } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Badge, Button, Card } from '@my-lex/ui';

import { useFlashcardsLearningCarouselStore } from '../hooks/useFlashcardsLearningCarouselStore';

import { cn } from '@/shared/utils';

export interface FlashcardsLearningCarouselResultsOverviewProps {
  className?: string;
}

export const FlashcardsLearningCarouselResultsOverview = ({
  className,
}: FlashcardsLearningCarouselResultsOverviewProps) => {
  const t = useTranslations();
  const {
    state,
    dispatch,
    activeFlashcards: flashcards,
    allFlashcardsLength,
  } = useFlashcardsLearningCarouselStore();

  const restartFlashcards = () => dispatch({ type: 'RESTART' });
  const restartOnlyLearning = () =>
    dispatch({ type: 'RESTART', onlyLearning: true });

  const stillLearningFlashcards = useMemo(
    () => flashcards.filter(card => state.stillLearningIds.includes(card.id)),
    [flashcards, state.stillLearningIds],
  );

  const knownPercentage = useMemo(
    () =>
      ((allFlashcardsLength - stillLearningFlashcards.length) /
        allFlashcardsLength) *
      100,
    [stillLearningFlashcards.length, allFlashcardsLength],
  );

  return (
    <Card
      className={cn(
        'flex flex-col w-full items-center justify-center gap-4',
        className,
      )}
    >
      <div className='flex flex-col gap-3 items-center justify-center'>
        {stillLearningFlashcards.length > 0 && (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <Badge className='bg-success'>
                {t('flashcards.learningCarousel.resultsOverview.known')} ({allFlashcardsLength - stillLearningFlashcards.length})
              </Badge>
              <Badge className='bg-warning'>
                {t('flashcards.learningCarousel.resultsOverview.stillLearning')} ({stillLearningFlashcards.length})
              </Badge>
            </div>

            <div className='bg-warning w-full h-2 rounded-md overflow-hidden shadow-md'>
              <div
                style={{ width: `${knownPercentage}%` }}
                className='bg-success h-full'
              ></div>
            </div>

            <Button className='text-warning' onClick={restartOnlyLearning}>
              {t('flashcards.learningCarousel.resultsOverview.focusOnStillLearningCards')} ({stillLearningFlashcards.length})
            </Button>
          </div>
        )}

        {stillLearningFlashcards.length === 0 && (
          <PartyPopper className='text-success animate-bounce' />
        )}

        <Button
          variant={stillLearningFlashcards.length > 0 ? 'ghost' : 'default'}
          className='self-stretch'
          onClick={restartFlashcards}
        >
          {t('flashcards.learningCarousel.resultsOverview.restartFlashcards')}
        </Button>
      </div>
    </Card>
  );
};
