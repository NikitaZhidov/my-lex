import { BadRequestException, Injectable } from '@nestjs/common';

import { UserProfile } from '@my-lex/shared-models';

import { SaveFlashcardDto } from './dto/save-flashcard.dto';
import { FlashcardsRepository } from './flashcards.repository';

@Injectable()
export class FlashcardsService {
  constructor(private readonly flashcardsRepository: FlashcardsRepository) {}

  async save(userId: UserProfile['id'], saveFlashcardDto: SaveFlashcardDto) {
    if (saveFlashcardDto.id) {
      const existingFlashcard = await this.flashcardsRepository.getById(
        saveFlashcardDto.id,
      );

      if (!existingFlashcard) {
        throw new BadRequestException('flashcards.notFound');
      }

      return await this.flashcardsRepository.update(saveFlashcardDto);
    }

    return await this.flashcardsRepository.create(userId, saveFlashcardDto);
  }

  async getAllByUserId(userId: UserProfile['id']) {
    return await this.flashcardsRepository.getByUserId(userId);
  }
}
