import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';

import AppToaster from './AppToaster';
import TanstackQueryProvider from './TanstackQueryProvider';
import { ThemeProvider } from './ThemeProvider';

const MainProvider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <TanstackQueryProvider>
        <AppToaster />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </TanstackQueryProvider>
    </ThemeProvider>
  );
};

export default MainProvider;
