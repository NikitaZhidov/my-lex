import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { UserFlashcards } from '@/features/flashcards/components';
import { prefetchFlashcards } from '@/features/flashcards/prefetch/prefetch-flashcards';

export default async function FlashcardsPage() {
  const queryClient = await prefetchFlashcards();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='flex flex-auto'>
        <div className='max-w-4xl md:w-4xl mx-auto px-4 pt-4'>
          <UserFlashcards />
        </div>
      </div>
    </HydrationBoundary>
  );
}
