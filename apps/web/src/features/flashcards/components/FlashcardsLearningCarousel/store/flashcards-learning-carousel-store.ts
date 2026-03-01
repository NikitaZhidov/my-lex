import { createContext, Dispatch } from 'react';

import { Flashcard } from '@my-lex/shared-models';

import { FlippableFlashcardProps } from '@/features/flashcards/ui';

type FlashcardView = FlippableFlashcardProps['view'];

export interface FlashcardsLearningCarouselStore {
  view: FlashcardView;
  defaultView: FlashcardView;

  activeIndex: number;
  direction: -1 | 1;
  showFlipAnimation: boolean;
  trackProgress: boolean;

  stillLearningIds: Flashcard['id'][];

  filteredFlashcardIds: Flashcard['id'][];
  filterFlashcards: boolean;
}

type Action =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_INDEX'; index: number }
  | { type: 'SET_VIEW'; view: FlashcardView }
  | { type: 'SET_TRACK_PROGRESS'; track: boolean }
  | { type: 'ADD_STILL_LEARNING'; id: Flashcard['id'] }
  | { type: 'REMOVE_STILL_LEARNING'; id: Flashcard['id'] }
  | { type: 'RESTART'; onlyLearning?: boolean }
  | { type: 'RESTORE_STATE'; state: FlashcardsLearningCarouselStore }
  | { type: 'SET_DEFAULT_VIEW'; view: FlashcardView };

export type FlashcardsLearningCarouselContext = {
  flashcards: Flashcard[];
  state: FlashcardsLearningCarouselStore;
  dispatch: Dispatch<Action>;
};

export const FlashcardsLearningCarouselContext = createContext<
  FlashcardsLearningCarouselContext | undefined
>(undefined);

export const flashcardsLearningCarouselInitialState: FlashcardsLearningCarouselStore =
  {
    defaultView: 'definition',
    activeIndex: 0,
    direction: 1,
    showFlipAnimation: false,
    view: 'term',
    trackProgress: false,
    filterFlashcards: false,
    stillLearningIds: [],
    filteredFlashcardIds: [],
  };

export const flashcardsLearningCarouselReducer = (
  state: FlashcardsLearningCarouselStore,
  action: Action,
): FlashcardsLearningCarouselStore => {
  switch (action.type) {
    case 'NEXT':
      return {
        ...state,
        activeIndex: state.activeIndex + 1,
        direction: 1,
        view: state.defaultView ?? 'term',
        showFlipAnimation: false,
      };
    case 'SET_INDEX':
      return {
        ...state,
        activeIndex: action.index,
        direction: action.index < state.activeIndex ? -1 : 1,
        showFlipAnimation: false,
      };
    case 'PREV':
      return {
        ...state,
        activeIndex: state.activeIndex - 1,
        direction: -1,
        view: state.defaultView ?? 'term',
        showFlipAnimation: false,
      };
    case 'SET_VIEW':
      return { ...state, view: action.view, showFlipAnimation: true };
    case 'SET_TRACK_PROGRESS':
      return { ...state, trackProgress: action.track, stillLearningIds: [] };
    case 'ADD_STILL_LEARNING':
      return {
        ...state,
        stillLearningIds: Array.from(
          new Set(
            (state.stillLearningIds ?? []).concat([action.id]).filter(Boolean),
          ),
        ),
      };
    case 'REMOVE_STILL_LEARNING':
      return {
        ...state,
        stillLearningIds: (state.stillLearningIds ?? []).filter(
          id => id !== action.id,
        ),
      };
    case 'RESTART':
      return {
        ...state,
        activeIndex: 0,
        showFlipAnimation: false,
        direction: -1,
        trackProgress: action.onlyLearning ?? false,
        filterFlashcards: action.onlyLearning ?? false,
        filteredFlashcardIds: action.onlyLearning ? state.stillLearningIds : [],
        stillLearningIds:
          (action.onlyLearning ?? false) ? state.stillLearningIds : [],
        view: state.defaultView ?? 'term',
      };
    case 'RESTORE_STATE':
      return action.state ? action.state : state;
    case 'SET_DEFAULT_VIEW':
      return {
        ...state,
        defaultView: action.view ?? 'term',
        view: action.view ?? 'term',
        showFlipAnimation: true,
      };
    default:
      return state;
  }
};
