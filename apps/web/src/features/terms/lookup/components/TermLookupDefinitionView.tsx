import { CircleCheck, SaveIcon, Trash } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Markdown from 'react-markdown';

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Spinner,
} from '@my-lex/ui';

import {
  useTermLookupDefinition,
  useTermLookupIsStreaming,
  useTermLookupSetTerm,
  useTermLookupTerm,
} from '../store';

import { useCreateFlashcardMutation } from '@/features/flashcards';

export const TermLookupDefinitionView = () => {
  const t = useTranslations();

  const term = useTermLookupTerm();
  const setTerm = useTermLookupSetTerm();
  const definition = useTermLookupDefinition();
  const streaming = useTermLookupIsStreaming();

  const removeTerm = () => {
    setTerm('');
  };

  const {
    create: createFlashcard,
    isCreated,
    isLoading,
  } = useCreateFlashcardMutation(term, definition);

  const saveCurrentTermAsFlashcard = () => {
    createFlashcard({ term, definition });
  };

  // HOT TODO: add edit button (try to use the lexical lib)

  return (
    <div>
      {term && (
        <motion.div
          initial={{ opacity: 0, translateY: '-20%' }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-bold'>{term}</CardTitle>

              <CardAction>
                {streaming ? (
                  <Spinner className='size-8' />
                ) : isCreated ? (
                  <CircleCheck className='text-success' />
                ) : (
                  <Button
                    disabled={isLoading}
                    onClick={saveCurrentTermAsFlashcard}
                    size='icon'
                  >
                    <SaveIcon />
                  </Button>
                )}
              </CardAction>
            </CardHeader>

            <CardContent className='prose dark:prose-invert'>
              <Markdown>{definition}</Markdown>
            </CardContent>

            <CardFooter>
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
