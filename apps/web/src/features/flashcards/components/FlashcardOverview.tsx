import { Edit, EllipsisVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode, useEffectEvent, useRef, useState } from 'react';

import { Flashcard } from '@my-lex/shared-models';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Separator,
} from '@my-lex/ui';

import { useDeleteFlashcardMutation, useSaveFlashcardMutation } from '../hooks';

import { MarkdownEditor, MarkdownView } from '@/features/text-editor';
import { useMousedownOutside } from '@/shared/hooks';
import { cn } from '@/shared/utils';

export interface FlashcardOverviewProps {
  flashcard: Pick<Flashcard, 'term' | 'definition' | 'id'>;
  initialEditMode?: boolean;
  showEditButton?: boolean;
  showSavedMessage?: boolean;
  className?: string;
  children?: ReactNode;
}

export const FlashcardOverview = ({
  flashcard,
  initialEditMode,
  showSavedMessage,
  showEditButton,
  className,
  children,
}: FlashcardOverviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  const { save: saveFlashcard } = useSaveFlashcardMutation({
    showSuccessMessage: showSavedMessage ?? false,
  });

  const { deleteCard, isLoading: isDeleting } = useDeleteFlashcardMutation();

  const [isEdit, setIsEdit] = useState(initialEditMode ?? false);

  const [term, setTerm] = useState(flashcard.term);
  const [definition, setDefinition] = useState(flashcard.definition);

  useMousedownOutside(
    containerRef,
    {
      condition: () => isEdit,
      func: () => disableEditMode(),
    },
    [isEdit],
  );

  const enableEditMode = () => {
    setTerm(flashcard.term);
    setDefinition(flashcard.definition);
    setIsEdit(true);
  };

  const disableEditMode = useEffectEvent(() => {
    if (isEdit) {
      if (term) {
        saveFlashcard({ term, definition, id: flashcard.id });
      }
      setIsEdit(false);
    }
  });

  const toggleEditMode = () => (isEdit ? disableEditMode() : enableEditMode());

  const deleteFlashcard = () => deleteCard(flashcard.id);

  return (
    <div ref={containerRef} className={cn('flex flex-col gap-0.5', className)}>
      <div className='flex justify-end gap-2'>
        {(showEditButton ?? true) && (
          <Button
            size='icon'
            onClick={toggleEditMode}
            className={cn(isEdit ? 'border border-warning' : '')}
            variant={isEdit ? 'secondary' : 'ghost'}
          >
            <Edit />
          </Button>
        )}

        {flashcard.id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' disabled={isDeleting} variant='ghost'>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem
                disabled={isDeleting}
                onClick={deleteFlashcard}
                variant='destructive'
                className='w-ful'
              >
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className='flex gap-4'>
        <div className='w-1/3 max-w-1/3 min-w-1/3'>
          {isEdit ? (
            <Input value={term} onChange={e => setTerm(e.target.value)} />
          ) : (
            <div className='font-bold text-xl pl-3'>{flashcard.term}</div>
          )}
        </div>

        <div>
          <Separator orientation='vertical' />
        </div>

        <div className='flex-auto'>
          {isEdit ? (
            <MarkdownEditor
              className='border-b-2 border-warning'
              initialMarkdown={definition}
              onChange={markdown => setDefinition(markdown)}
              autoFocus={false}
            />
          ) : (
            <MarkdownView markdown={flashcard.definition} />
          )}
        </div>
      </div>

      {children}
    </div>
  );
};
