import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { ThemeToggle } from './ThemeToggle';

const mockSetTheme = jest.fn();

jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    (
      {
        'theme.light': 'Light',
        'theme.dark': 'Dark',
        'theme.system': 'System',
      } as Record<string, string>
    )[key] ?? key,
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const openThemeMenu = async () => {
    const trigger = screen.getByRole('button', { name: 'Toggle theme' });
    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(await screen.findByRole('menuitem', { name: 'Light' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Dark' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'System' })).toBeVisible();
  };

  it('renders three theme modes in dropdown', async () => {
    render(<ThemeToggle />);

    await openThemeMenu();
  });

  it('sets light theme', async () => {
    render(<ThemeToggle />);

    await openThemeMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Light' }));

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('sets dark theme', async () => {
    render(<ThemeToggle />);

    await openThemeMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Dark' }));

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('sets system theme', async () => {
    render(<ThemeToggle />);

    await openThemeMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: 'System' }));

    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});
