'use client';

import { useTranslations } from 'next-intl';

import { TermLookup } from '@/features/terms/lookup/components';
import { useProfile } from '@/features/users/hooks';

// HOT TODO: remove use client later

// HOT TODO: hide the settings button for long texts
// HOT TODO: separate handler for long texts

export default function MainPage() {
  const t = useTranslations('home');
  const { profile } = useProfile();
  const firstName = profile?.name?.split(' ')[0];

  return (
    <div className='flex flex-auto'>
      <div className='max-w-4xl md:w-4xl mx-auto px-4 pt-4'>
        <div>
          <div className='text-5xl mt-70 text-center'>
            {t('greeting', { name: firstName ?? '' })}
          </div>
          <div className='flex mt-8 w-full'>
            <TermLookup />
          </div>
        </div>
      </div>
    </div>
  );
}
