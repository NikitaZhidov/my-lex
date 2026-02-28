import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Flashcard } from '@my-lex/shared-models';
import { Card } from '@my-lex/ui';

import { FlashcardOverview } from '../FlashcardOverview';

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
        <div className='flex flex-col gap-4 flex-auto'>
          {flashcards.map(card => (
            <Card key={card.id} className='py-2 px-6'>
              <FlashcardOverview className='pb-6' flashcard={card} />
            </Card>
          ))}
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
