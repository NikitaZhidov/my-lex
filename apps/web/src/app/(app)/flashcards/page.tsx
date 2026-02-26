import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { UserFlashcards } from '@/features/flashcards/components';
import { prefetchFlashcards } from '@/features/flashcards/prefetch/prefetch-flashcards';

export default async function FlashcardsPage() {
  const queryClient = await prefetchFlashcards();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='flex flex-auto'>
        <div className='w-full md:p-16 sm:p-8 p-2'>
          <UserFlashcards />
        </div>
      </div>
    </HydrationBoundary>
  );
}
