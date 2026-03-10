import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import AppGreeting from './AppGreeting';

const profileName = 'User test';

const mockUserProfile = {
  profile: {
    email: 'test@test.com',
    name: profileName,
    picture: '',
    id: 'test-id',
  },
  isLoading: false,
};

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params: { name: string }) =>
    `Hello, ${params.name}`,
}));
jest.mock('../utils', () => ({
  cn: (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' '),
}));
jest.mock('../../features/users/hooks', () => ({
  useProfile: () => mockUserProfile,
}));

const greetingText = (userName: string) => `Hello, ${userName.split(' ')[0]}`;

it('Renders greeting text with only first name', async () => {
  render(<AppGreeting />);

  expect(screen.getByText(greetingText(profileName))).toBeInTheDocument();
});
