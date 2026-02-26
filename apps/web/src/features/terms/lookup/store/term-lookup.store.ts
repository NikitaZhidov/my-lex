import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Flashcard, TermSettings } from '@my-lex/shared-models';

import { termsService } from '../../services/terms.service';

interface TermLookupStoreState {
  settings: TermSettings;
  settingsChecked: boolean;
  streaming: boolean;
  term: string;
  definition: string;
  flashcardId?: Flashcard['id'];
}

type TermLookupPersistedState = Required<
  Pick<TermLookupStoreState, 'settings' | 'settingsChecked'>
>;

interface TermLookupStoreMethods {
  updateSettings: <T extends keyof TermSettings>(
    key: T,
    value: TermSettings[T],
  ) => void;
  handleTerm: (term: string) => void;
  setTerm: (term: string) => void;
  setDefinition: (definition: string) => void;
  stopStreaming: VoidFunction;
  reset: VoidFunction;
  markSettingsAsChecked: VoidFunction;
  setFlashcardId: (flashcardId: Flashcard['id']) => void;
}

interface TermLookupStore
  extends TermLookupStoreState,
    TermLookupStoreMethods {}

const initialState: TermLookupStoreState = {
  settings: {
    includeExamples: true,
    includeExplanation: true,
    includeSynonyms: true,
    includeTranslation: true,
    hideTermInExamples: true,
    learningLanguage: '',
  },

  settingsChecked: false,

  streaming: false,

  term: '',
  definition: '',
  flashcardId: undefined,
};

const clearTerm = (term: string) => term?.trim();

const useTermLookupStore = create(
  persist<TermLookupStore>(
    (set, get) => {
      let eventSource: EventSource | undefined = undefined;

      return {
        ...initialState,

        updateSettings<T extends keyof TermSettings>(
          key: T,
          value: TermSettings[T],
        ) {
          set({ settings: { ...get().settings, [key]: value } });
        },

        stopStreaming: () => {
          set({ streaming: false });

          if (eventSource) {
            eventSource.close();
            eventSource = undefined;
          }

          return;
        },

        setTerm: term => {
          set({ term });
        },

        setDefinition: definition => set({ definition }),

        handleTerm: (term: string) => {
          term = clearTerm(term);

          set({ term, definition: '', flashcardId: undefined });

          get().stopStreaming();

          if (!term) {
            return;
          }

          eventSource = termsService.getTermDefinitionStream(
            term,
            get().settings,
          );

          set({ streaming: true });

          eventSource.onmessage = e =>
            set({ definition: get().definition + e.data });

          eventSource.onerror = err => {
            get().stopStreaming();
          };

          return;
        },

        markSettingsAsChecked: () => {
          if (!get().settingsChecked) {
            set({ settingsChecked: true });
          }

          return;
        },

        setFlashcardId: id => set({ flashcardId: id }),

        reset: () => set({ term: '', definition: '' }),
      };
    },
    {
      name: 'term-lookup-storage',
      partialize: state => {
        const savedValues: TermLookupPersistedState = {
          settings: state.settings,
          settingsChecked: state.settingsChecked,
        };

        return savedValues as TermLookupStore;
      },
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useTermLookupSettings = () =>
  useTermLookupStore(store => store.settings);
export const useTermLookupUpdateSettings = () =>
  useTermLookupStore(store => store.updateSettings);

export const useTermLookupTerm = () => useTermLookupStore(store => store.term);
export const useTermLookupTermSetTerm = () =>
  useTermLookupStore(store => store.setTerm);
export const useTermLookupHandleTerm = () =>
  useTermLookupStore(store => store.handleTerm);

export const useTermLookupIsStreaming = () =>
  useTermLookupStore(store => store.streaming);

export const useTermLookupStopStreaming = () =>
  useTermLookupStore(store => store.stopStreaming);

export const useTermLookupDefinition = () =>
  useTermLookupStore(store => store.definition);
export const useTermLookupSetDefinition = () =>
  useTermLookupStore(store => store.setDefinition);

export const useTermLookupStoreReset = () =>
  useTermLookupStore(store => store.reset);

export const useTermLookupSettingsChecked = () =>
  useTermLookupStore(store => store.settingsChecked);
export const useTermLookupMarkSettingsAsChecked = () =>
  useTermLookupStore(store => store.markSettingsAsChecked);

export const useTermLookupFlashcardId = () =>
  [
    useTermLookupStore(store => store.flashcardId),
    useTermLookupStore(store => store.setFlashcardId),
  ] as const;
