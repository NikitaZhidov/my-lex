'use client';

import { TermLookup } from '@/features/terms/lookup/components';
import { useProfile } from '@/features/users/hooks';

// HOT TODO: remove use client later

// HOT TODO: save the user locale in the database and use it in the prompt (or just take it from the cookie)

// HOT TODO: hide the settings button for long texts
// HOT TODO: separate handler for long texts

export default function MainPage() {
  const { profile } = useProfile();

  return (
    <div className='flex flex-auto'>
      <div className='max-w-4xl md:w-4xl mx-auto px-4 pt-4'>
        <div>
          {/* HOT TODO: add translation */}
          <div className='text-5xl mt-70 text-center'>
            Hello, {profile?.name?.split(' ')[0]}!
          </div>
          <div className='flex mt-8 w-full'>
            <TermLookup />
          </div>
        </div>
      </div>
    </div>
  );
}
