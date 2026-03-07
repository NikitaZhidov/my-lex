import { AIModelProvider } from '../types/ai-model-provider';

export class MockAIModelProvider implements AIModelProvider {
  constructor(
    protected readonly responseTextData: string,
    protected readonly includePromptInResponse = true,
  ) {}

  async responseText(prompt: string): Promise<string> {
    return new Promise<string>(res => res(this.getResponseText(prompt)));
  }

  async *responseTextStream(
    prompt: string,
    abortSignal?: AbortSignal,
  ): AsyncIterable<string> {
    const responseTextDataParts = this.getResponseText(prompt)
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

  private getResponseText(prompt: string) {
    const promptSuffix = this.includePromptInResponse
      ? `\n\nYour prompt: ${prompt}`
      : '';

    return this.responseTextData + promptSuffix;
  }
}
