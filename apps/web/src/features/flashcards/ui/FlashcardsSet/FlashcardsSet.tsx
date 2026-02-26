import { Flashcard } from '@my-lex/shared-models';

import { FlashcardView } from '../FlashcardView';

export interface FlashcardsSetProps {
  flashcards: Flashcard[];
}

export const FlashcardsSet = ({ flashcards }: FlashcardsSetProps) => {
  return (
    <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'>
      {flashcards.map(card => (
        <FlashcardView flashcard={card} key={card.id} />
      ))}
    </div>
  );
};
