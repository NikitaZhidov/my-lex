import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { APP_NAME, APP_ROUTES, HOME_ROUTE, STORAGE_KEYS } from '@/constants';

import { AppSidebar } from './AppSidebar';

const mockUsePathname = jest.fn();
const mockUseIsSmallScreen = jest.fn();
const mockUseBlockBodyScroll = jest.fn();
const mockSetCookie = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('../hooks', () => ({
  DEFAULT_SMALL_SCREEN_THRESHOLD: 768,
  useIsSmallScreen: () => mockUseIsSmallScreen(),
  useBlockBodyScroll: (block: boolean) => mockUseBlockBodyScroll(block),
}));

jest.mock('../utils', () => ({
  cn: (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' '),
  setCookie: (...args: [string, string]) => mockSetCookie(...args),
}));

const renderSidebar = (initialCollapsedState = false) =>
  render(<AppSidebar initialCollapsedState={initialCollapsedState} />);

describe('AppSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue(HOME_ROUTE);
    mockUseIsSmallScreen.mockReturnValue(false);
    window.innerWidth = 1200;
  });

  it('marks active route based on pathname', () => {
    mockUsePathname.mockReturnValue(APP_ROUTES.FLASHCARDS);
    renderSidebar();

    const flashcardsButton = screen
      .getByText('common.Flashcards')
      .closest('button');
    const vocabularyButton = screen
      .getByText('common.AIVocabulary')
      .closest('button');

    expect(flashcardsButton).toHaveAttribute('data-variant', 'secondary');
    expect(vocabularyButton).toHaveAttribute('data-variant', 'ghost');
  });

  it('collapses and expands sidebar', () => {
    const { container } = renderSidebar();
    const aside = container.querySelector('aside');

    expect(aside).toHaveClass('w-60');

    const collapseButton = screen.getByRole('button', { name: '' });
    fireEvent.click(collapseButton);

    expect(aside).toHaveClass('w-14');
    expect(mockSetCookie).toHaveBeenCalledWith(
      STORAGE_KEYS.APP_SIDEBAR_COLLAPSED,
      JSON.stringify(true),
    );

    const logoButtons = screen.getAllByRole('button', { name: APP_NAME });
    fireEvent.click(logoButtons[0]);

    expect(aside).toHaveClass('w-60');
    expect(mockSetCookie).toHaveBeenLastCalledWith(
      STORAGE_KEYS.APP_SIDEBAR_COLLAPSED,
      JSON.stringify(false),
    );
  });

  it('collapses on backdrop click when expanded', () => {
    const { container } = renderSidebar();
    const aside = container.querySelector('aside');
    const backdrop = container.querySelector('.bg-black\\/40');

    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop as Element);

    expect(aside).toHaveClass('w-14');
    expect(container.querySelector('.bg-black\\/40')).not.toBeInTheDocument();
    expect(mockSetCookie).toHaveBeenCalledWith(
      STORAGE_KEYS.APP_SIDEBAR_COLLAPSED,
      JSON.stringify(true),
    );
  });

  it('auto-hides on small screen after route click', () => {
    mockUseIsSmallScreen.mockReturnValue(true);
    const { container } = renderSidebar();
    const aside = container.querySelector('aside');

    fireEvent.click(screen.getByText('common.Flashcards'));

    expect(aside).toHaveClass('w-14');
    expect(mockSetCookie).toHaveBeenCalledWith(
      STORAGE_KEYS.APP_SIDEBAR_COLLAPSED,
      JSON.stringify(true),
    );
    expect(mockUseBlockBodyScroll).toHaveBeenCalledWith(true);
  });
});