import { Injectable } from '@nestjs/common';

import { User } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardsMapper } from './mappers/flashcards.mapper';

@Injectable()
export class FlashcardsRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: FlashcardsMapper,
  ) {}

  async create(userId: User['id'], create: CreateFlashcardDto) {
    const flashcard = await this.prismaService.flashcard.create({
      data: {
        term: create.term,
        definition: create.definition,
        userId,
      },
    });

    return this.mapper.toFlashcardDto(flashcard);
  }

  async getByUserId(userId: User['id']) {
    const flashcards = await this.prismaService.flashcard.findMany({
      where: { userId },
    });

    return flashcards.map(this.mapper.toFlashcardDto);
  }
}
