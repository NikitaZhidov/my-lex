import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { LLMService } from '../llm/llm.service';

@Injectable()
export class TermsService {
  constructor(private readonly llm: LLMService) {}

  getTermStreamDefinition(term: string): Observable<string> {
    // HOT TODO: probably here should be some handling of the term (removing unnecessary spaces and so on) or check the guard
    // HOT TODO: wrap the term with a prompt here

    return new Observable(obs => {
      const contrller = new AbortController();

      obs.add(() => contrller.abort());

      (async () => {
        try {
          for await (const chunk of this.llm.streamResponse(
            term,
            contrller.signal,
          )) {
            obs.next(chunk);
          }

          obs.complete();
        } catch {
          obs.complete();
        }
      })();
    });
  }
}
