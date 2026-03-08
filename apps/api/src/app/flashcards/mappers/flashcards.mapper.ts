import { Injectable } from '@nestjs/common';

import { Flashcard } from '@my-lex/prisma-generated';
import { Flashcard as FlashcardDto } from '@my-lex/shared-models';

@Injectable()
export class FlashcardsMapper {
  toFlashcardDto(flashcard: Flashcard): FlashcardDto {
    return {
      term: flashcard.term,
      definition: flashcard.definition,
      id: flashcard.id,
      createdAt: flashcard.createdAt,
      updatedAt: flashcard.updatedAt,
    };
  }
}
