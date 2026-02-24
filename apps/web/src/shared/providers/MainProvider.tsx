import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';

import { TooltipProvider } from '@my-lex/ui';

import AppToaster from './AppToaster';
import TanstackQueryProvider from './TanstackQueryProvider';
import { ThemeProvider } from './ThemeProvider';

const MainProvider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <TooltipProvider>
        <TanstackQueryProvider>
          <AppToaster />
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </TanstackQueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default MainProvider;
