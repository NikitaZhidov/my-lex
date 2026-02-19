'use client';

// HOT TODO: remove use client later
import { useTranslations } from 'next-intl';

import { Button } from '@my-lex/ui';

import { useLogoutMutation } from '@/features/auth/hooks';

export default function Index() {
  const t = useTranslations();
  const { logout, isLoading } = useLogoutMutation();

  return (
    <div>
      <Button onClick={() => logout()} disabled={isLoading}>
        {t('auth.logout')}
      </Button>
    </div>
  );
}
