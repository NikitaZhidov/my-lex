import { Module } from '@nestjs/common';

import { AIModelModule } from '../ai-model/ai-model.module';

import { UserAIModelService } from './user-ai-model.service';

@Module({
  imports: [AIModelModule],
  providers: [UserAIModelService],
  exports: [UserAIModelService],
})
export class UserAIModelModule {}
