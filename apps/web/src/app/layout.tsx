import { Metadata } from 'next';

import '../styles/global.css';

import { APP_NAME } from '@/constants/app-name';
import MainProvider from '@/shared/providers/MainProvider';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      absolute: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
