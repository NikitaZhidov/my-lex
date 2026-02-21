export type AIModelProviderName = 'google' | 'openai';

export interface AIModelProvider {
  responseText(prompt: string): Promise<string>;
  responseTextStream(
    prompt: string,
    abortSignal?: AbortSignal,
  ): AsyncIterable<string>;
}
