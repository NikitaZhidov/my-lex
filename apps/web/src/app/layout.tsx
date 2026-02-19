import { Metadata } from 'next';
import { cookies } from 'next/headers';

import '../styles/global.css';

import { APP_NAME } from '@/constants/app-name';
import MainProvider from '@/shared/providers/MainProvider';
import { getAppLocaleFromCookies } from '@/shared/utils';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      absolute: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getAppLocaleFromCookies(await cookies());

  return (
    <html suppressHydrationWarning lang={locale}>
      <body>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
