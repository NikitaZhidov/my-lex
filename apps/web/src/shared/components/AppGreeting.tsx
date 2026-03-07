'use client';

import { useTranslations } from 'next-intl';

import { cn } from '../utils';

import { useProfile } from '@/features/users/hooks';

export interface AppGreetingProps {
  className?: string;
}

const AppGreeting = ({ className }: AppGreetingProps) => {
  const t = useTranslations();
  const { profile } = useProfile();
  const firstName = profile?.name?.split(' ')[0];

  return (
    <div
      className={cn(className, 'md:text-5xl sm:text-4xl text-3xl text-center')}
    >
      {t('home.greeting', { name: firstName ?? '' })}
    </div>
  );
};

export default AppGreeting;
