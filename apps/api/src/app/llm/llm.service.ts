import { Inject, Injectable } from '@nestjs/common';

import { AI_MODEL } from '../ai-model/factories/ai-model-provider.factory';
import { type AIModelProvider } from '../ai-model/types/ai-model-provider';

@Injectable()
export class LLMService {
  constructor(
    @Inject(AI_MODEL)
    private readonly ai: AIModelProvider,
  ) {}

  async response(prompt: string) {
    return this.ai.responseText(prompt);
  }

  streamResponse(
    prompt: string,
    abortSignal?: AbortSignal,
  ): AsyncIterable<string> {
    return this.ai.responseTextStream(prompt, abortSignal);
  }
}
