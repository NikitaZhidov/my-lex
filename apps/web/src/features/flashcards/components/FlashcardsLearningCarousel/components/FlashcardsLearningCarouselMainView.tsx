import { motion } from 'motion/react';
import { useMemo } from 'react';

import { useFlashcardsLearningCarouselStore } from '../hooks/useFlashcardsLearningCarouselStore';

import { FlashcardsLearningCarouselResultsOverview } from './FlashcardsLearningCarouselResultsOverview';
import {
  FlippableFlashcard,
  FlippableFlashcardProps,
} from '@/features/flashcards';

export const mainViewHeightClasses =
  'sm:h-100 sm:min-h-100 sm:max-h-100 h-80 min-h-80 max-h-80';

export interface FlashcardsLearningCarouselMainViewProps {
  className?: string;
}

export const FlashcardsLearningCarouselMainView = ({
  className,
}: FlashcardsLearningCarouselMainViewProps) => {
  const {
    state,
    dispatch,
    activeFlashcards: flashcards,
  } = useFlashcardsLearningCarouselStore();

  const changeView = (view: FlippableFlashcardProps['view']) =>
    dispatch({ type: 'SET_VIEW', view });

  const activeFlashcard = useMemo(
    () => flashcards[state.activeIndex],
    [state.activeIndex, flashcards],
  );

  if (!activeFlashcard) {
    return (
      <FlashcardsLearningCarouselResultsOverview
        className={mainViewHeightClasses}
      />
    );
  }

  return (
    <div className={className}>
      <motion.div
        key={state.activeIndex}
        initial={{
          translateX: 150 * state.direction,
          opacity: 0,
          rotate: 5 * state.direction,
        }}
        animate={{ translateX: 0, opacity: 1, rotate: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
        style={{ perspective: 1000 }}
      >
        <FlippableFlashcard
          className={mainViewHeightClasses}
          view={state.view}
          onViewChange={changeView}
          flashcard={activeFlashcard}
          flipAnimation={state.showFlipAnimation}
        />
      </motion.div>
    </div>
  );
};
