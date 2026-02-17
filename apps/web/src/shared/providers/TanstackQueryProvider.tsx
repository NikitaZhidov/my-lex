'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

import { getQueryClient } from '../utils/get-query-client';

const TanstackQueryProvider = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackQueryProvider;
