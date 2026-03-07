import { Module } from '@nestjs/common';

import { UserAIModelModule } from '../user-ai-model/user-ai-model.module';
import { UsersModule } from '../users/users.module';

import { LexicalPromptBuilderFactory } from './lexical-prompt-builders';
import { TermsController } from './terms.controller';
import { TermsService } from './terms.service';

@Module({
  controllers: [TermsController],
  providers: [TermsService, LexicalPromptBuilderFactory],
  imports: [UserAIModelModule, UsersModule],
})
export class TermsModule {}
