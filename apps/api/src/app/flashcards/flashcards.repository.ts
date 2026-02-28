import { Injectable } from '@nestjs/common';

import { Flashcard, User } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { SaveFlashcardDto } from './dto/save-flashcard.dto';
import { FlashcardsMapper } from './mappers/flashcards.mapper';

@Injectable()
export class FlashcardsRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: FlashcardsMapper,
  ) {}

  async create(userId: User['id'], saveFlashcard: SaveFlashcardDto) {
    const flashcard = await this.prismaService.flashcard.create({
      data: {
        term: saveFlashcard.term,
        definition: saveFlashcard.definition,
        userId,
      },
    });

    return this.mapper.toFlashcardDto(flashcard);
  }

  async update(saveFlashcard: SaveFlashcardDto) {
    const flashcard = await this.prismaService.flashcard.update({
      where: { id: saveFlashcard.id },
      data: { term: saveFlashcard.term, definition: saveFlashcard.definition },
    });

    return flashcard;
  }

  async getById(id: Flashcard['id']) {
    const flashcard = await this.prismaService.flashcard.findFirst({
      where: { id },
    });

    return flashcard ? this.mapper.toFlashcardDto(flashcard) : null;
  }

  async delete(id: Flashcard['id']) {
    await this.prismaService.flashcard.delete({ where: { id } });
  }

  async getByUserId(userId: User['id']) {
    const flashcards = await this.prismaService.flashcard.findMany({
      where: { userId },
    });

    return flashcards.map(this.mapper.toFlashcardDto);
  }
}
