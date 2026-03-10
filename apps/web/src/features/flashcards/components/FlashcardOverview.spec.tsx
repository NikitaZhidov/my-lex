import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { FlashcardOverview } from './FlashcardOverview';

const mockSaveFlashcard = jest.fn();
const mockDeleteFlashcard = jest.fn();
const mockUseSaveFlashcardMutation = jest.fn();
const mockUseDeleteFlashcardMutation = jest.fn();
const mockUseMousedownOutside = jest.fn();

type OutsideConfig = {
  condition: () => boolean;
  func: () => void;
};

let outsideConfig: OutsideConfig | undefined;

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('../hooks', () => ({
  useSaveFlashcardMutation: (...args: unknown[]) =>
    mockUseSaveFlashcardMutation(...args),
  useDeleteFlashcardMutation: () => mockUseDeleteFlashcardMutation(),
}));

jest.mock('../../../shared/hooks', () => ({
  useMousedownOutside: (...args: unknown[]) => mockUseMousedownOutside(...args),
}));

jest.mock('../../text-editor', () => ({
  MarkdownView: ({ markdown }: { markdown: string }) => <div>{markdown}</div>,
  MarkdownEditor: ({
    initialMarkdown,
    onChange,
  }: {
    initialMarkdown: string;
    onChange: (val: string) => void;
  }) => (
    <div>
      <div>{initialMarkdown}</div>
      <button onClick={() => onChange('updated definition')}>
        update-definition
      </button>
    </div>
  ),
}));

jest.mock('../../../shared/utils', () => ({
  cn: (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' '),
}));

describe('FlashcardOverview (RTL integration)', () => {
  const flashcard = {
    id: 'card-1',
    term: 'Original term',
    definition: 'Original definition',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    outsideConfig = undefined;

    mockUseSaveFlashcardMutation.mockReturnValue({
      save: mockSaveFlashcard,
    });
    mockUseDeleteFlashcardMutation.mockReturnValue({
      deleteCard: mockDeleteFlashcard,
      isLoading: false,
    });

    mockUseMousedownOutside.mockImplementation(
      (_ref: unknown, config: OutsideConfig) => {
        outsideConfig = config;
      },
    );
  });

  it('enters edit mode on edit click', () => {
    render(<FlashcardOverview flashcard={flashcard} />);

    const editButton = document.querySelector('button[data-variant="ghost"]');
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton as Element);

    expect(screen.getByDisplayValue('Original term')).toBeInTheDocument();
    expect(screen.getByText('update-definition')).toBeInTheDocument();
  });

  it('autosaves on outside click while editing', async () => {
    render(<FlashcardOverview flashcard={flashcard} />);

    const editButton = document.querySelector('button[data-variant="ghost"]');
    fireEvent.click(editButton as Element);

    fireEvent.change(screen.getByDisplayValue('Original term'), {
      target: { value: 'Updated term' },
    });
    fireEvent.click(screen.getByText('update-definition'));

    expect(outsideConfig).toBeDefined();
    expect(outsideConfig?.condition()).toBe(true);
    await act(async () => {
      outsideConfig?.func();
    });

    expect(mockSaveFlashcard).toHaveBeenCalledWith({
      id: 'card-1',
      term: 'Updated term',
      definition: 'updated definition',
    });
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Updated term')).not.toBeInTheDocument();
    });
  });

  it('runs delete action from dropdown menu', async () => {
    const { container } = render(<FlashcardOverview flashcard={flashcard} />);

    const menuTrigger = container.querySelector('button[aria-haspopup="menu"]');
    expect(menuTrigger).toBeInTheDocument();

    fireEvent.keyDown(menuTrigger as Element, { key: 'Enter' });
    fireEvent.click(await screen.findByRole('menuitem', { name: 'common.delete' }));

    expect(mockDeleteFlashcard).toHaveBeenCalledWith('card-1');
  });
});
