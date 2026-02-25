import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

import { STORAGE_KEYS } from '@/constants';
import { AppHeader, AppSidebar } from '@/shared/components';
import { prefetchAppData } from '@/shared/utils';
import { getCookieValue } from '@/shared/utils/cookies-utils';

const getSidebarInitialCollapsedState = async () => {
  const cookieValue = await getCookieValue(STORAGE_KEYS.APP_SIDEBAR_COLLAPSED);

  if (cookieValue) {
    return cookieValue === 'true';
  }

  return false;
};

export default async function AppLayout({ children }: PropsWithChildren) {
  const queryClient = await prefetchAppData();
  const sidebarInitialState = await getSidebarInitialCollapsedState();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='min-h-screen w-full flex'>
        <AppSidebar
          className='max-h-screen h-screen sticky top-0'
          initialCollapsedState={sidebarInitialState}
        />

        <div className='flex flex-col flex-auto bg-sidebar'>
          <AppHeader className='sticky top-0 bg-background shadow-xs z-0' />

          <div className='flex-auto flex'>{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
