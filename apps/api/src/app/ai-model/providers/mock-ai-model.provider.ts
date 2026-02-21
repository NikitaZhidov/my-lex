import { AIModelProvider } from '../types/ai-model-provider';

export class MockAIModelProvider implements AIModelProvider {
  private readonly responseTextData = `Hello! No AI model is activated in this project. To change this you need to update the configuration of the server :)`;

  responseText(prompt: string): Promise<string> {
    return new Promise<string>(res => res(this.responseTextData));
  }

  async *responseTextStream(
    prompt: string,
    abortSignal?: AbortSignal,
  ): AsyncIterable<string> {
    const responseTextDataParts = (
      this.responseTextData +
      '\n' +
      `Your prompt: ${prompt}`
    )
      .split(' ')
      .map(part => (part += ' '));
    responseTextDataParts[responseTextDataParts.length - 1] =
      responseTextDataParts.at(-1)?.trimEnd() ?? '';

    for (const part of responseTextDataParts) {
      if (abortSignal?.aborted) return;
      await new Promise<void>(res => setTimeout(() => res(), 30));
      yield part;
    }

    return;
  }
}
