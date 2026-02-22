import { TermSettings } from '@my-lex/shared-models';

export class TermsService {
  getTermDefinitionStream(term: string, settings?: TermSettings) {
    const params = new URLSearchParams();

    Object.entries(settings ?? {}).forEach(([key, value]) =>
      params.append(key, `${value}`),
    );

    params.append('term', term);

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/terms/definition/stream?${params.toString()}`,
      {
        withCredentials: true,
      },
    );
    return eventSource;
  }
}

export const termsService = new TermsService();
