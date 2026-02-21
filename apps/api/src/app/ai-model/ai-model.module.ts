import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  AI_MODEL,
  AIModelProviderFactory,
} from './factories/ai-model-provider.factory';

@Module({
  providers: [
    {
      provide: AI_MODEL,
      useFactory: AIModelProviderFactory,
      inject: [ConfigService],
    },
  ],
  exports: [AI_MODEL],
})
export class AIModelModule {}
