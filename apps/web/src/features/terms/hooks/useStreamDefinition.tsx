import { useEffect, useRef, useState } from 'react';

import { TermSettings } from '@my-lex/shared-models';

import { termsService } from '../services/terms.service';

// HOT TODO: add debounce time

export const useStreamDefinition = () => {
  const eventSourceRef = useRef<EventSource | undefined>(undefined);
  const [definition, setDefinition] = useState('');
  const [term, setTerm] = useState<string | undefined>('');
  const [streaming, setStreaming] = useState(false);

  const stop = () => {
    setStreaming(false);
    const eventSource = eventSourceRef.current;

    if (eventSource) {
      eventSource.close();
      eventSourceRef.current = undefined;
    }
  };

  useEffect(() => {
    return () => stop();
  }, []);

  // HOT TODO: properly handle the term that has already been used in the previous request
  const handleTerm = (term: string | undefined, settings?: TermSettings) => {
    setTerm(term);
    setDefinition('');

    stop();

    if (!term) {
      return;
    }

    const eventSource = termsService.getTermDefinitionStream(term, settings);

    setStreaming(true);

    eventSource.onmessage = e =>
      setDefinition(currentDefinitionState => currentDefinitionState + e.data);
    eventSource.onerror = err => {
      stop();
    };

    eventSourceRef.current = eventSource;
  };

  return { handleTerm, stop, term, definition, streaming };
};
