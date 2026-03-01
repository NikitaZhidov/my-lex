import { AnimatePresence, motion } from 'motion/react';
import { useMemo } from 'react';

import { useFlashcardsLearningCarouselStore } from '../hooks/useFlashcardsLearningCarouselStore';

import { FlashcardsLearningCarouselResultsOverview } from './FlashcardsLearningCarouselResultsOverview';
import {
  FlippableFlashcard,
  FlippableFlashcardProps,
} from '@/features/flashcards';

export const FlashcardsLearningCarouselMainView = () => {
  const { state, dispatch, flashcards } = useFlashcardsLearningCarouselStore();

  const changeView = (view: FlippableFlashcardProps['view']) =>
    dispatch({ type: 'SET_VIEW', view });

  const activeFlashcard = useMemo(
    () => flashcards[state.activeIndex],
    [state.activeIndex, flashcards],
  );

  if (!activeFlashcard) {
    return (
      <FlashcardsLearningCarouselResultsOverview className='h-100 min-h-100' />
    );
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={state.activeIndex}
        initial={{
          x: 150 * state.direction,
          opacity: 0,
          rotate: 5 * state.direction,
        }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
        style={{ perspective: 1000 }}
      >
        <FlippableFlashcard
          className='h-100 min-h-100 max-h-100'
          view={state.view}
          onViewChange={changeView}
          flashcard={activeFlashcard}
          flipAnimation={state.showFlipAnimation}
        />
      </motion.div>
    </AnimatePresence>
  );
};
