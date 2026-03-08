import { type User } from '@my-lex/prisma-generated';
import { type Flashcard } from '@my-lex/shared-models';

import { prisma } from './prisma';

export const createFlashcard = async (card: Flashcard, userId: User['id']) => {
  return await prisma.flashcard.create({
    data: {
      term: card.term,
      definition: card.definition,
      userId,
    },
  });
};
