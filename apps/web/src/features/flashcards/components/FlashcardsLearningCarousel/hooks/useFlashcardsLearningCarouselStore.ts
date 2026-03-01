import { useContext } from 'react';

import { FlashcardsLearningCarouselContext } from '../store/flashcards-learning-carousel-store';

export const useFlashcardsLearningCarouselStore = () => {
  return useContext(
    FlashcardsLearningCarouselContext,
  ) as FlashcardsLearningCarouselContext;
};
