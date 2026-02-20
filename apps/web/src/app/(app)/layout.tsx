'use client';

// HOT TODO: remove use client later
import { useTranslations } from 'next-intl';
import { PropsWithChildren } from 'react';

import { Button } from '@my-lex/ui';

import { useLogoutMutation } from '@/features/auth/hooks';
import { LocaleSwitcher, ThemeToggle } from '@/shared/components';

// HOT TODO: change the favicon

export default function AppLayout({ children }: PropsWithChildren) {
  const t = useTranslations();
  const { logout, isLoading } = useLogoutMutation();

  return (
    <div className='min-h-screen w-full'>
      <div className='bg-accent/40 py-2 px-4 flex items-center justify-end'>
        <div className='flex items-center gap-8'>
          <div className='flex items-center gap-2'>
            <LocaleSwitcher />

            <ThemeToggle />
          </div>

          <Button onClick={() => logout()} disabled={isLoading}>
            {t('auth.logout')}
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
