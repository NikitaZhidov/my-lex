import { Injectable } from '@nestjs/common';

import { UserProfile } from '@my-lex/shared-models';

import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardsRepository } from './flashcards.repository';

@Injectable()
export class FlashcardsService {
  constructor(private readonly flashcardsRepository: FlashcardsRepository) {}

  async create(
    userId: UserProfile['id'],
    createFlashcardDto: CreateFlashcardDto,
  ) {
    return await this.flashcardsRepository.create(userId, createFlashcardDto);
  }

  async getAllByUserId(userId: UserProfile['id']) {
    return await this.flashcardsRepository.getByUserId(userId);
  }
}
