import { ConfigService } from '@nestjs/config';

import { GoogleAIModelProvider } from '../providers/google-ai-model.provider';
import { MockAIModelProvider } from '../providers/mock-ai-model.provider';
import { OpenAIAIModelProvider } from '../providers/open-ai-ai-model.provider';
import {
  AIModelProvider,
  AIModelProviderName,
} from '../types/ai-model-provider';

export const AI_MODEL = Symbol('AI model');

export const AIModelProviderFactory = (
  configService: ConfigService,
): AIModelProvider => {
  const providerName =
    configService.getOrThrow<AIModelProviderName>('AI_PROVIDER');

  switch (providerName) {
    case 'google':
      return new GoogleAIModelProvider(
        configService.getOrThrow<string>('GOOGLE_AI_API_KEY'),
      );
    case 'openai':
      return new OpenAIAIModelProvider(
        configService.getOrThrow<string>('OPENAI_API_KEY'),
      );
    default: {
      console.warn('YOU ARE USING MOCK AI MODEL PROVIDER!');
      return new MockAIModelProvider();
    }
  }
};
