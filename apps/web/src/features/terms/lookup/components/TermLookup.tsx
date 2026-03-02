'use client';

import { AnimatePresence, motion } from 'motion/react';
import { PropsWithChildren, useEffect, useMemo } from 'react';

import {
  useTermLookupDefinition,
  useTermLookupStoreReset,
  useTermLookupTerm,
} from '../store';

import { TermLookupDefinitionView } from './TermLookupDefinitionView';
import { TermLookupTextarea } from './TermLookupTextarea';
import { cn } from '@/shared/utils';

export interface TermLookupProps extends PropsWithChildren {
  hasTermClassname?: string;
  noTermClassname?: string;
  className?: string;
}

export const TermLookup = ({
  children,
  hasTermClassname,
  noTermClassname,
  className,
}: TermLookupProps) => {
  const reset = useTermLookupStoreReset();

  const term = useTermLookupTerm();
  const definition = useTermLookupDefinition();
  const hasTerm = useMemo(
    () => (term && term.length > 0) || (definition && definition.length > 0),
    [term, definition],
  );

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div
      className={cn(
        `w-full`,
        className,
        hasTerm ? hasTermClassname : noTermClassname,
      )}
    >
      <AnimatePresence>
        {!hasTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, scale: 0, height: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className='w-full flex flex-col gap-6'>
        <TermLookupTextarea />
        <TermLookupDefinitionView />
      </div>
    </div>
  );
};
