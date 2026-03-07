import { useEffect, useState } from 'react';

import { Flashcard } from '@my-lex/shared-models';

import { FlashcardsLearningCarouselFooter } from './components/FlashcardsLearningCarouselFooter';
import { FlashcardsLearningCarouselMainView } from './components/FlashcardsLearningCarouselMainView';
import { FlashcardsLearningCarouselProvider } from './components/FlashcardsLearningCarouselProvider';
import { FlashcardsLearningCarouselSkeletonLoader } from './components/FlashcardsLearningCarouselSkeletonLoader';
import { cn } from '@/shared/utils';

export interface FlashcardsLearningCarouselProps {
  className?: string;
  flashcards: Flashcard[];
}

export const FlashcardsLearningCarousel = ({
  className,
  flashcards,
}: FlashcardsLearningCarouselProps) => {
  const [mounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!flashcards.length) {
    return <></>;
  }

  if (!mounted) {
    return <FlashcardsLearningCarouselSkeletonLoader />;
  }

  return (
    <FlashcardsLearningCarouselProvider flashcards={flashcards}>
      <div className={cn('flex flex-col gap-2 max-w-full', className)}>
        <FlashcardsLearningCarouselMainView className='max-w-full overflow-hidden' />

        <FlashcardsLearningCarouselFooter />
      </div>
    </FlashcardsLearningCarouselProvider>
  );
};
