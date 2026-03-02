import { Flashcard } from '@my-lex/shared-models';
import { Card } from '@my-lex/ui';

import { MarkdownView } from '@/features/text-editor';
import { cn } from '@/shared/utils';

export interface FlippableFlashcardProps {
  flashcard: Pick<Flashcard, 'term' | 'definition'>;
  view: 'term' | 'definition';
  onViewChange?: (view: FlippableFlashcardProps['view']) => void;
  className?: string;
  flipAnimation?: boolean;
}

export const FlippableFlashcard = ({
  flashcard,
  view,
  className,
  onViewChange,
  flipAnimation,
}: FlippableFlashcardProps) => {
  const changeView = () => {
    if (view === 'definition') {
      onViewChange?.('term');
    } else {
      onViewChange?.('definition');
    }
  };

  return (
    <div className='perspective-midrange'>
      <Card
        onClick={changeView}
        className={cn(
          'transform-3d relative cursor-pointer',
          view === 'definition' ? 'rotate-x-180' : '',
          (flipAnimation ?? true) ? 'transition-transform duration-200' : '',
          className,
        )}
      >
        <div className='absolute inset-0 backface-hidden overflow-y-auto flex justify-center items-center overflow-hidden text-4xl font-bold'>
          {flashcard.term}
        </div>

        <div
          className={cn(
            'absolute inset-0 rotate-x-180 backface-hidden',
            view === 'definition' ? 'overflow-y-auto' : 'overflow-hidden',
          )}
        >
          <div className='w-full min-full p-4 flex justify-center'>
            <MarkdownView markdown={flashcard.definition} />
          </div>
        </div>
      </Card>
    </div>
  );
};
