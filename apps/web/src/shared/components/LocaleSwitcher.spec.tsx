import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { STORAGE_KEYS } from '@/constants';

import { LocaleSwitcher } from './LocaleSwitcher';

const mockUseLocale = jest.fn();
const mockRouterRefresh = jest.fn();
const mockSetCookie = jest.fn();

jest.mock('next-intl', () => ({
  useLocale: () => mockUseLocale(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRouterRefresh,
  }),
}));

jest.mock('../utils', () => ({
  getLocaleLabel: (locale: string) =>
    ({ en: 'English', ru: 'Русский' })[locale as 'en' | 'ru'] ?? 'Unknown',
  SUPPORTED_LOCALES: ['en', 'ru'],
  setCookie: (...args: [string, string]) => mockSetCookie(...args),
}));

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocale.mockReturnValue('en');
  });

  it('changes locale, sets cookie and refreshes router', async () => {
    render(<LocaleSwitcher />);

    const trigger = screen.getByRole('button', { name: 'English' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.click(await screen.findByText('Русский'));

    expect(mockSetCookie).toHaveBeenCalledWith(STORAGE_KEYS.LOCALE, 'ru');
    expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
  });

  it('does nothing when selecting current locale', async () => {
    render(<LocaleSwitcher />);

    const trigger = screen.getByRole('button', { name: 'English' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.click(await screen.findByRole('menuitem', { name: 'English' }));

    expect(mockSetCookie).not.toHaveBeenCalled();
    expect(mockRouterRefresh).not.toHaveBeenCalled();
  });
});
