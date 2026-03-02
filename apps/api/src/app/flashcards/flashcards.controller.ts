import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Flashcard, UserProfile } from '@my-lex/shared-models';

import { Authorized } from '../auth/decorators/authorized.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';

import { SaveFlashcardDto } from './dto/save-flashcard.dto';
import { FlashcardsService } from './flashcards.service';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @UseGuards(AuthGuard)
  @Post()
  save(
    @Body() saveFlashCardDto: SaveFlashcardDto,
    @Authorized('id') userId: UserProfile['id'],
  ) {
    return this.flashcardsService.save(userId, saveFlashCardDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getUserCards(@Authorized('id') userId: UserProfile['id']) {
    return this.flashcardsService.getAllByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':flashcardId')
  delete(@Param('flashcardId') flashcardId: Flashcard['id']) {
    return this.flashcardsService.delete(flashcardId);
  }
}
