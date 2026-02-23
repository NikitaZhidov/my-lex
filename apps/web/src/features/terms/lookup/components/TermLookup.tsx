'use client';

import { useEffect } from 'react';

import { useTermLookupStoreReset } from '../store';

import { TermLookupDefinitionView } from './TermLookupDefinitionView';
import { TermLookupTextarea } from './TermLookupTextarea';

export const TermLookup = () => {
  const reset = useTermLookupStoreReset();

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className='w-full flex flex-col gap-6'>
      <TermLookupTextarea />
      <TermLookupDefinitionView />
    </div>
  );
};
