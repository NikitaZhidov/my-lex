import { EditIcon, PlusCircle, SaveIcon, Trash } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffectEvent, useRef, useState } from 'react';
import Markdown from 'react-markdown';

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Spinner,
} from '@my-lex/ui';

import {
  useTermLookupDefinition,
  useTermLookupFlashcardId,
  useTermLookupHandleTerm,
  useTermLookupIsStreaming,
  useTermLookupSetDefinition,
  useTermLookupTerm,
  useTermLookupTermSetTerm,
} from '../store';

import { useSaveFlashcardMutation } from '@/features/flashcards';
import { MarkdownEditor } from '@/features/text-editor';
import { useMousedownOutside } from '@/shared/hooks';
import { cn } from '@/shared/utils';

export const TermLookupDefinitionView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  const term = useTermLookupTerm();
  const setTerm = useTermLookupTermSetTerm();

  const handleTerm = useTermLookupHandleTerm();
  const streaming = useTermLookupIsStreaming();

  const definition = useTermLookupDefinition();
  const setDefinition = useTermLookupSetDefinition();

  const [flashcardId, setFlashcardId] = useTermLookupFlashcardId();
  const [edit, setEdit] = useState(false);

  const removeTerm = () => {
    setEdit(false);
    handleTerm('');
  };

  const { save: saveFlashcard, isLoading } = useSaveFlashcardMutation({
    onSuccess: card => setFlashcardId(card.id),
  });

  const saveCurrentTermAsFlashcard = () => {
    setEdit(false);
    saveFlashcard({ term, definition, id: flashcardId });
  };

  useMousedownOutside(
    containerRef,
    {
      condition: () => edit,
      func: () => disableEditMode(),
    },
    [edit],
  );

  const enableEditMode = () => setEdit(true);

  const disableEditMode = useEffectEvent(() => {
    if (edit) {
      if (flashcardId) {
        saveCurrentTermAsFlashcard();
      } else {
        setEdit(false);
      }
    }
  });

  const toggleEdit = () => (edit ? disableEditMode() : enableEditMode());

  return (
    <div>
      {(term || definition) && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, translateY: '-20%' }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className='sm:py-6 py-4'>
            <CardHeader className='md:pr-6 sm:pr-4 pr-3'>
              {edit ? (
                <Input value={term} onChange={e => setTerm(e.target.value)} />
              ) : (
                <CardTitle className='text-xl font-bold'>{term}</CardTitle>
              )}

              <CardAction>
                {streaming ? (
                  <Spinner className='size-8' />
                ) : (
                  <div className='flex items-center gap-1'>
                    <Button
                      variant={edit ? 'secondary' : 'ghost'}
                      className={cn(edit ? 'border border-warning' : '')}
                      onClick={toggleEdit}
                      size='icon'
                    >
                      <EditIcon />
                    </Button>

                    <Button
                      disabled={isLoading}
                      onClick={saveCurrentTermAsFlashcard}
                      size='icon'
                      variant={flashcardId ? 'outline' : 'default'}
                    >
                      {flashcardId ? <SaveIcon /> : <PlusCircle />}
                    </Button>
                  </div>
                )}
              </CardAction>
            </CardHeader>

            <CardContent>
              {edit ? (
                <MarkdownEditor
                  className='border p-2'
                  initialMarkdown={definition}
                  onChange={setDefinition}
                />
              ) : (
                <div className='prose dark:prose-invert'>
                  <Markdown>{definition}</Markdown>
                </div>
              )}
            </CardContent>

            <CardFooter className='sticky bottom-4 bg-card'>
              {!streaming && (
                <Button
                  onClick={removeTerm}
                  className='w-full'
                  variant='outline'
                >
                  <Trash />
                  {t('common.clear')}
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
