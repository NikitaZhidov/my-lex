import { debounce } from 'lodash';
import { ReactNode, useEffect, useMemo, useReducer, useState } from 'react';

import { Flashcard } from '@my-lex/shared-models';

import {
  FlashcardsLearningCarouselContext,
  flashcardsLearningCarouselInitialState,
  flashcardsLearningCarouselReducer,
  FlashcardsLearningCarouselStore,
} from '../store/flashcards-learning-carousel-store';

const SAVED_STATE_KEY = '__flashcards-learning-carousel__';
const SAVE_DEBOUNCE_TIME = 500;

export interface FlashcardsLearningCarouselProviderProps {
  children?: ReactNode;
  flashcards: Flashcard[];
}

export const FlashcardsLearningCarouselProvider = ({
  children,
  flashcards,
}: FlashcardsLearningCarouselProviderProps) => {
  const [restored, setRestored] = useState(false);

  const [state, dispatch] = useReducer(
    flashcardsLearningCarouselReducer,
    flashcardsLearningCarouselInitialState,
  );

  const filteredFlashcards = useMemo(() => {
    if (state.filterFlashcards) {
      return flashcards.filter(card =>
        (state.filteredFlashcardIds ?? []).includes(card.id),
      );
    }

    return flashcards;
  }, [state.filterFlashcards, state.filteredFlashcardIds, flashcards]);

  const saveCurrentState = debounce(
    (state: FlashcardsLearningCarouselStore) => {
      if (restored) {
        localStorage.setItem(SAVED_STATE_KEY, JSON.stringify(state));
      }
    },
    SAVE_DEBOUNCE_TIME,
  );

  useEffect(() => {
    if (!restored) {
      const state = localStorage.getItem(SAVED_STATE_KEY);

      if (state) {
        dispatch({ type: 'RESTORE_STATE', state: JSON.parse(state) });
      }

      setRestored(true);
    }
  }, []);

  useEffect(() => {
    saveCurrentState(state);
    return () => saveCurrentState.cancel();
  }, [state]);

  return (
    <FlashcardsLearningCarouselContext.Provider
      value={{ state, dispatch, flashcards: filteredFlashcards }}
    >
      {children}
    </FlashcardsLearningCarouselContext.Provider>
  );
};
