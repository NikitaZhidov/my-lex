import Markdown from 'react-markdown';

import { Flashcard } from '@my-lex/shared-models';
import { Card, CardContent, CardHeader, CardTitle } from '@my-lex/ui';

export interface FlashcardProps {
  flashcard: Flashcard;
}

export const FlashcardView = ({ flashcard }: FlashcardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{flashcard.term}</CardTitle>
      </CardHeader>

      <CardContent className='prose dark:prose-invert'>
        <Markdown>{flashcard.definition}</Markdown>
      </CardContent>
    </Card>
  );
};
