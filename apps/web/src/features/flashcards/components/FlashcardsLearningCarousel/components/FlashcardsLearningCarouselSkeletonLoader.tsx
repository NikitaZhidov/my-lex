import { Skeleton } from '@my-lex/ui';

export const FlashcardsLearningCarouselSkeletonLoader = () => {
  return (
    <div className='flex flex-col gap-2'>
      <Skeleton className='w-full h-100 rounded-lg' />

      <div className='flex items-center justify-center gap-4'>
        <Skeleton className='w-9 h-9' />
        <Skeleton className='w-5 h-5' />
        <Skeleton className='w-9 h-9' />
      </div>
    </div>
  );
};
