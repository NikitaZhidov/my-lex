import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button, Popover, PopoverContent, PopoverTrigger } from '@my-lex/ui';

import { FlashcardOverview } from '../FlashcardOverview';

import { cn } from '@/shared/utils';

export interface FlashcardAddButtonProps {
  className?: string;
}

export const FlashcardAddButton = ({ className }: FlashcardAddButtonProps) => {
  const t = useTranslations();
  const [addPopoverOpen, setAddPopoverOpen] = useState(false);

  return (
    <Popover open={addPopoverOpen} onOpenChange={setAddPopoverOpen}>
      <PopoverTrigger asChild>
        <Button className={cn(className)}>{t('common.add')}</Button>
      </PopoverTrigger>

      <PopoverContent className='min-w-90 sm:min-w-120'>
        <FlashcardOverview
          initialEditMode={true}
          showEditButton={false}
          showSavedMessage={true}
          flashcard={{ term: '', definition: '' }}
        >
          <Button
            onClick={() => setAddPopoverOpen(false)}
            variant='secondary'
            className={'mt-4'}
          >
            {t('common.cancel')}
          </Button>
        </FlashcardOverview>
      </PopoverContent>
    </Popover>
  );
};
