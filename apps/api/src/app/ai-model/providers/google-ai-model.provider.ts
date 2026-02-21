import { GoogleGenAI } from '@google/genai';

import { AIModelProvider } from '../types/ai-model-provider';

// !!! It's not tested very well, maybe some adjustments are necessary

export class GoogleAIModelProvider implements AIModelProvider {
  private readonly MODEL = 'gemini-2.0-flash';

  private readonly ai = new GoogleGenAI({
    apiKey: this.apiKey,
  });

  constructor(private readonly apiKey: string) {}

  async responseText(prompt: string): Promise<string> {
    const res = await this.ai.models.generateContent({
      model: this.MODEL,
      contents: prompt,
    });

    return res.text ?? '';
  }

  async *responseTextStream(
    prompt: string,
    abortSignal?: AbortSignal,
  ): AsyncIterable<string> {
    try {
      const res = await this.ai.models.generateContentStream({
        contents: prompt,
        model: this.MODEL,
        config: {
          abortSignal,
        },
      });

      for await (const chunk of res) {
        yield chunk.text ?? '';
      }
    } catch (err) {
      console.error(err);
    }
  }
}
