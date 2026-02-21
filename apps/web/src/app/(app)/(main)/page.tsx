'use client';

import { useProfile } from '@/features/users/hooks';

// HOT TODO: remove use client later

export default function MainPage() {
  const { profile } = useProfile();

  return (
    <div className='flex flex-auto'>
      <div className='max-w-4xl mx-auto px-4 pt-4'>
        <div>
          {/* HOT TODO: add translation */}
          <div className='text-5xl mt-70'>
            Hello, {profile?.name?.split(' ')[0]}!
          </div>
        </div>
      </div>
    </div>
  );
}
