import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';

import { TermLookupDefinitionView } from './TermLookupDefinitionView';

const mockTermSetTerm = jest.fn();
const mockHandleTerm = jest.fn();
const mockSetDefinition = jest.fn();
const mockSetFlashcardId = jest.fn();
const mockSaveFlashcard = jest.fn();

const mockUseTerm = jest.fn();
const mockUseStreaming = jest.fn();
const mockUseDefinition = jest.fn();
const mockUseFlashcardId = jest.fn();
const mockUseSaveMutation = jest.fn();

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('../store', () => ({
  useTermLookupTerm: () => mockUseTerm(),
  useTermLookupTermSetTerm: () => mockTermSetTerm,
  useTermLookupHandleTerm: () => mockHandleTerm,
  useTermLookupIsStreaming: () => mockUseStreaming(),
  useTermLookupDefinition: () => mockUseDefinition(),
  useTermLookupSetDefinition: () => mockSetDefinition,
  useTermLookupFlashcardId: () => mockUseFlashcardId(),
}));

jest.mock('../../../flashcards', () => ({
  useSaveFlashcardMutation: (...args: unknown[]) => mockUseSaveMutation(...args),
}));

jest.mock('../../../../shared/utils', () => ({
  cn: (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' '),
}));

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../text-editor', () => ({
  MarkdownEditor: ({ initialMarkdown }: { initialMarkdown: string }) => (
    <div>{initialMarkdown}</div>
  ),
}));

describe('TermLookupDefinitionView (RTL integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTerm.mockReturnValue('apple');
    mockUseDefinition.mockReturnValue('A fruit');
    mockUseStreaming.mockReturnValue(false);
    mockUseFlashcardId.mockReturnValue([undefined, mockSetFlashcardId]);
    mockUseSaveMutation.mockImplementation(
      ({ onSuccess }: { onSuccess?: (card: { id: string }) => void }) => ({
        save: (payload: unknown) => {
          mockSaveFlashcard(payload);
          onSuccess?.({ id: 'new-card-id' });
        },
        isLoading: false,
      }),
    );
  });

  it('shows spinner and hides clear button while streaming', () => {
    mockUseStreaming.mockReturnValue(true);
    render(<TermLookupDefinitionView />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'common.clear' })).not.toBeInTheDocument();
  });

  it('enters edit mode and renders term input', () => {
    const { container } = render(<TermLookupDefinitionView />);

    const editButton = container.querySelector('button[data-variant="ghost"]');
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton as Element);

    expect(screen.getByDisplayValue('apple')).toBeInTheDocument();
  });

  it('saves term as flashcard', () => {
    const { container } = render(<TermLookupDefinitionView />);
    const saveButton = container.querySelector('button[data-variant="default"]');

    expect(saveButton).toBeInTheDocument();

    fireEvent.click(saveButton as Element);

    expect(mockSaveFlashcard).toHaveBeenCalledWith({
      term: 'apple',
      definition: 'A fruit',
      id: undefined,
    });
    expect(mockSetFlashcardId).toHaveBeenCalledWith('new-card-id');
  });

  it('clears term on clear button click', () => {
    render(<TermLookupDefinitionView />);

    fireEvent.click(screen.getByRole('button', { name: 'common.clear' }));

    expect(mockHandleTerm).toHaveBeenCalledWith('');
  });

  it('disables save button while save mutation is loading', () => {
    mockUseSaveMutation.mockImplementation(() => ({
      save: mockSaveFlashcard,
      isLoading: true,
    }));

    const { container } = render(<TermLookupDefinitionView />);
    const saveButton = container.querySelector('button[data-variant="default"]');

    expect(saveButton).toBeDisabled();
  });
});
