import { cn } from '../utils';

import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { UserProfile } from './UserProfile';

export interface AppHeaderProps {
  className?: string;
}

export const AppHeader = ({ className }: AppHeaderProps) => {
  return (
    <div className={cn('py-2 px-4 flex items-center justify-end', className)}>
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-2'>
          <LocaleSwitcher />

          <ThemeToggle />
        </div>

        <UserProfile />
      </div>
    </div>
  );
};
