import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';

import AppToaster from './AppToaster';
import TanstackQueryProvider from './TanstackQueryProvider';

const MainProvider = ({ children }: PropsWithChildren) => {
  return (
    <TanstackQueryProvider>
      <AppToaster />
      <NextIntlClientProvider>{children}</NextIntlClientProvider>
    </TanstackQueryProvider>
  );
};

export default MainProvider;
