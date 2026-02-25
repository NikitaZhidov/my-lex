import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';

import { FlashcardsController } from './flashcards.controller';
import { FlashcardsRepository } from './flashcards.repository';
import { FlashcardsService } from './flashcards.service';
import { FlashcardsMapper } from './mappers/flashcards.mapper';

@Module({
  controllers: [FlashcardsController],
  providers: [FlashcardsService, FlashcardsRepository, FlashcardsMapper],
  imports: [UsersModule],
})
export class FlashcardsModule {}
