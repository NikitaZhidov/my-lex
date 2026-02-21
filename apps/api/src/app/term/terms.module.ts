import { Module } from '@nestjs/common';

import { LLMModule } from '../llm/llm.module';
import { UsersModule } from '../users/users.module';

import { TermsController } from './terms.controller';
import { TermsService } from './terms.service';

@Module({
  controllers: [TermsController],
  providers: [TermsService],
  imports: [LLMModule, UsersModule],
})
export class TermsModule {}
