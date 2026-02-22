import OpenAI from 'openai';
import { ResponseTextDeltaEvent } from 'openai/lib/responses/EventTypes.js';
import { ResponseStreamEvent } from 'openai/resources/responses/responses.js';
import { type ResponsesModel } from 'openai/resources/shared.js';

import { AIModelProvider } from '../types/ai-model-provider';

export class OpenAIAIModelProvider implements AIModelProvider {
  private readonly MODEL: ResponsesModel = 'gpt-4';

  private readonly ai = new OpenAI({
    apiKey: this.apiKey,
  });

  constructor(private readonly apiKey: string) {}

  async responseText(prompt: string): Promise<string> {
    const res = await this.ai.responses.create({
      model: this.MODEL,
      input: prompt,
    });

    return res.output_text ?? '';
  }

  async *responseTextStream(
    prompt: string,
    abortSignal?: AbortSignal,
  ): AsyncIterable<string> {
    try {
      const res = await this.ai.responses.create(
        {
          input: prompt,
          model: this.MODEL,
          stream: true,
        },
        { signal: abortSignal },
      );

      for await (const event of res) {
        if (this.isOutputTextDeltaEvent(event)) {
          yield event.delta;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  private isOutputTextDeltaEvent(
    chunk: ResponseStreamEvent,
  ): chunk is ResponseTextDeltaEvent {
    return chunk.type === 'response.output_text.delta';
  }
}
