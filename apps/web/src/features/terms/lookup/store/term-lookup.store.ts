import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TermSettings } from '@my-lex/shared-models';

import { termsService } from '../../services/terms.service';

interface TermLookupStoreState {
  settings: TermSettings;
  settingsChecked: boolean;
  streaming: boolean;
  term: string;
  definition: string;
}

type TermLookupPersistedState = Required<
  Pick<TermLookupStoreState, 'settings' | 'settingsChecked'>
>;

interface TermLookupStoreMethods {
  updateSettings: <T extends keyof TermSettings>(
    key: T,
    value: TermSettings[T],
  ) => void;
  setTerm: (term: string) => void;
  stopStreaming: VoidFunction;
  reset: VoidFunction;
  markSettingsAsChecked: VoidFunction;
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

        setTerm: (term: string) => {
          term = clearTerm(term);

          set({ term, definition: '' });

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
export const useTermLookupSetTerm = () =>
  useTermLookupStore(store => store.setTerm);

export const useTermLookupIsStreaming = () =>
  useTermLookupStore(store => store.streaming);

export const useTermLookupStopStreaming = () =>
  useTermLookupStore(store => store.stopStreaming);

export const useTermLookupDefinition = () =>
  useTermLookupStore(store => store.definition);

export const useTermLookupStoreReset = () =>
  useTermLookupStore(store => store.reset);

export const useSettingsChecked = () =>
  useTermLookupStore(store => store.settingsChecked);
export const useMarkSettingsAsChecked = () =>
  useTermLookupStore(store => store.markSettingsAsChecked);
