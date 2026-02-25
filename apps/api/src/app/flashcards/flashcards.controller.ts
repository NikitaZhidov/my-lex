import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserProfile } from '@my-lex/shared-models';

import { Authorized } from '../auth/decorators/authorized.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';

import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardsService } from './flashcards.service';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createFlashcardDto: CreateFlashcardDto,
    @Authorized('id') userId: UserProfile['id'],
  ) {
    return this.flashcardsService.create(userId, createFlashcardDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getUserCards(@Authorized('id') userId: UserProfile['id']) {
    return this.flashcardsService.getAllByUserId(userId);
  }
}
