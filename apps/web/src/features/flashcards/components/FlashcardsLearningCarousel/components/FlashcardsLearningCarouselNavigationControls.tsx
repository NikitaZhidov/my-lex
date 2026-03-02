import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Undo2,
  X,
} from 'lucide-react';
import { useMemo } from 'react';

import { Button } from '@my-lex/ui';

import { useFlashcardsLearningCarouselStore } from '../hooks/useFlashcardsLearningCarouselStore';

export const FlashcardsLearningCarouselNavigationControls = () => {
  const {
    activeFlashcards: flashcards,
    state,
    dispatch,
  } = useFlashcardsLearningCarouselStore();

  const canClickPrev = useMemo(
    () => state.activeIndex > 0,
    [state.activeIndex],
  );

  const canClickNext = useMemo(
    () => state.activeIndex < flashcards.length,
    [state.activeIndex, flashcards.length],
  );

  const clickPrev = () => {
    if (canClickPrev) {
      dispatch({ type: 'PREV' });
    }
  };

  const clickNext = () => {
    if (canClickNext) {
      dispatch({ type: 'NEXT' });
    }
  };

  const markAsKnown = () => {
    const id = flashcards[state.activeIndex].id;

    if (id) {
      dispatch({ type: 'REMOVE_STILL_LEARNING', id });
    }

    clickNext();
  };

  const returnToPrevious = () => {
    const id = flashcards[state.activeIndex - 1]?.id;

    if (id) {
      dispatch({ type: 'REMOVE_STILL_LEARNING', id });
    }

    clickPrev();
  };

  const markAsUnknown = () => {
    const id = flashcards[state.activeIndex]?.id;

    if (id) {
      dispatch({ type: 'ADD_STILL_LEARNING', id });
    }

    clickNext();
  };

  const currentIndexView = useMemo(
    () => state.activeIndex + 1,
    [state.activeIndex],
  );

  const isLastIndex = useMemo(
    () => state.activeIndex === flashcards.length - 1,
    [flashcards.length, state.activeIndex],
  );

  if (state.trackProgress) {
    return (
      <div className='flex items-center gap-2 relative'>
        <Button onClick={markAsUnknown} size='icon'>
          <X className='text-warning' />
        </Button>

        <div>
          {currentIndexView}/{flashcards.length}
        </div>

        <Button onClick={markAsKnown} size='icon'>
          <Check className='text-success' />
        </Button>

        <Button
          onClick={returnToPrevious}
          disabled={!canClickPrev}
          variant='secondary'
          size='icon'
          className='absolute left-full ml-2'
        >
          <Undo2 />
        </Button>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <Button size='icon' onClick={clickPrev} disabled={!canClickPrev}>
        <ArrowLeft />
      </Button>

      <div>
        {currentIndexView}/{flashcards.length}
      </div>

      <Button size='icon' onClick={clickNext} disabled={!canClickNext}>
        {isLastIndex ? <CircleCheck /> : <ArrowRight />}
      </Button>
    </div>
  );
};
