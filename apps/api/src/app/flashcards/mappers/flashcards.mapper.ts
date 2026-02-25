import { Injectable } from '@nestjs/common';

import { Flashcard as FlashcardDto } from '@my-lex/shared-models';

import { Flashcard } from '../../../generated/prisma/client';

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
