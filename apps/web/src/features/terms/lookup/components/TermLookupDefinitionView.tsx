import { SaveIcon } from 'lucide-react';
import Markdown from 'react-markdown';

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from '@my-lex/ui';

import {
  useTermLookupDefinition,
  useTermLookupIsStreaming,
  useTermLookupTerm,
} from '../store';

export const TermLookupDefinitionView = () => {
  const term = useTermLookupTerm();
  const definition = useTermLookupDefinition();
  const streaming = useTermLookupIsStreaming();

  // HOT TODO: implement saving (useMutation)
  // HOT TODO: add edit button (try to use the lexical lib)

  return (
    <div>
      {term && (
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>{term}</CardTitle>

            <CardAction>
              {streaming ? (
                <Spinner className='size-8' />
              ) : (
                <Button size='icon'>
                  <SaveIcon />
                </Button>
              )}
            </CardAction>
          </CardHeader>

          <CardContent className='prose dark:prose-invert'>
            <Markdown>{definition}</Markdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
