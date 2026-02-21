import { Module } from '@nestjs/common';

import { AIModelModule } from '../ai-model/ai-model.module';

import { LLMService } from './llm.service';

@Module({
  providers: [LLMService],
  exports: [LLMService],
  imports: [AIModelModule],
})
export class LLMModule {}
