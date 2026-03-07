import { Skeleton } from '@my-lex/ui';

import { mainViewHeightClasses } from './FlashcardsLearningCarouselMainView';
import { cn } from '@/shared/utils';

export const FlashcardsLearningCarouselSkeletonLoader = () => {
  return (
    <div className='flex flex-col gap-2'>
      <Skeleton className={cn('w-full rounded-lg', mainViewHeightClasses)} />

      <div className='flex items-center justify-center gap-4'>
        <Skeleton className='w-9 h-9' />
        <Skeleton className='w-5 h-5' />
        <Skeleton className='w-9 h-9' />
      </div>
    </div>
  );
};
