import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  AIModelProviderFactory,
  APP_DEFAULT_AI_MODEL,
} from './factories/ai-model-provider.factory';

@Module({
  providers: [
    {
      provide: APP_DEFAULT_AI_MODEL,
      useFactory: AIModelProviderFactory,
      inject: [ConfigService],
    },
  ],
  exports: [APP_DEFAULT_AI_MODEL],
})
export class AIModelModule {}
