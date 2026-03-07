import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Flashcard } from '@my-lex/shared-models';
import { Card } from '@my-lex/ui';

import { FlashcardOverview } from '../../components/FlashcardOverview';
import { FlashcardsLearningCarousel } from '../../components/FlashcardsLearningCarousel/FlashcardsLearningCarousel';

import { FlashcardAddButton } from './FlashcardAddButton';

export interface FlashcardsSetProps {
  flashcards: Flashcard[];
}

export const FlashcardsSet = ({ flashcards }: FlashcardsSetProps) => {
  const t = useTranslations();

  const hasFlashcards = useMemo(
    () => flashcards.length > 0,
    [flashcards.length],
  );

  return (
    <div className='flex flex-col gap-4 pb-4 h-full'>
      {hasFlashcards ? (
        <div className='w-full flex flex-col md:gap-16 sm:gap-12 gap-10 flex-auto'>
          <FlashcardsLearningCarousel flashcards={flashcards} />

          <div className='flex flex-col gap-4 flex-auto md:px-6 sm:px-2'>
            {flashcards.map(card => (
              <Card
                key={card.id}
                className='py-2 sm:px-6 px-2 sm:max-h-96 max-h-80 overflow-y-auto'
              >
                <FlashcardOverview className='pb-6' flashcard={card} />
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className='flex-auto text-xl font-light text-secondary-foreground flex justify-center mt-[40%]'>
          {t('flashcards.noFlashcards')}
        </div>
      )}

      <FlashcardAddButton className='sticky bottom-4 w-1/2 mx-auto shadow-2xl' />
    </div>
  );
};
