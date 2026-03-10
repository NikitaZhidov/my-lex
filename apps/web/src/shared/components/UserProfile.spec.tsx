import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { UserProfile } from './UserProfile';

const mockLogout = jest.fn();
const mockUseProfile = jest.fn();
const mockUseLogoutMutation = jest.fn();

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    ({ 'auth.logout': 'Logout' })[key] ?? key,
}));

jest.mock('../../features/users/hooks', () => ({
  useProfile: () => mockUseProfile(),
}));

jest.mock('../../features/auth/hooks', () => ({
  useLogoutMutation: () => mockUseLogoutMutation(),
}));

describe('UserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProfile.mockReturnValue({ profile: null });
    mockUseLogoutMutation.mockReturnValue({
      logout: mockLogout,
      isLoading: false,
    });
  });

  const openProfileMenu = (container: HTMLElement) => {
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]');
    expect(trigger).toBeInTheDocument();
    fireEvent.keyDown(trigger as Element, { key: 'Enter' });
  };

  it('renders skeleton when profile is missing', () => {
    const { container } = render(<UserProfile />);

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    expect(screen.queryByText('J')).not.toBeInTheDocument();
  });

  it('renders user avatar/fallback when profile exists', () => {
    mockUseProfile.mockReturnValue({
      profile: {
        name: 'John Doe',
        picture: '',
      },
    });

    const { container } = render(<UserProfile />);

    expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('calls logout on logout item click', async () => {
    mockUseProfile.mockReturnValue({
      profile: {
        name: 'John Doe',
        picture: '',
      },
    });

    const { container } = render(<UserProfile />);
    openProfileMenu(container);

    fireEvent.click(await screen.findByRole('menuitem', { name: 'Logout' }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('disables logout item while loading', async () => {
    mockUseProfile.mockReturnValue({
      profile: {
        name: 'John Doe',
        picture: '',
      },
    });
    mockUseLogoutMutation.mockReturnValue({
      logout: mockLogout,
      isLoading: true,
    });

    const { container } = render(<UserProfile />);
    openProfileMenu(container);

    const logoutItem = await screen.findByRole('menuitem', { name: 'Logout' });
    expect(logoutItem).toHaveAttribute('aria-disabled', 'true');
    expect(logoutItem).toHaveAttribute('data-disabled', '');
  });
});
