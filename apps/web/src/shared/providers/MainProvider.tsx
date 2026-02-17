import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';

import TanstackQueryProvider from './TanstackQueryProvider';

const MainProvider = ({ children }: PropsWithChildren) => {
  return (
    <TanstackQueryProvider>
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </TanstackQueryProvider>
  );
};

export default MainProvider;
