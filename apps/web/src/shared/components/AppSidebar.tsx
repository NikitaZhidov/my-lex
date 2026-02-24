'use client';

import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import { Button } from '@my-lex/ui';

import appLogo from '../../../public/app-logo/app-logo-sm.png';
import { cn, setCookie } from '../utils';

import { APP_NAME, STORAGE_KEYS } from '@/constants';

export interface AppSidebarProps {
  className?: string;
  initialCollapsedState: boolean;
}

const APP_LOGO_SIZE = 36;

const collapsedSidebarWidthClass = 'w-14';
const collapsedSidebarMaxWidthClass = 'max-w-14';

export const AppSidebar = ({
  className,
  initialCollapsedState,
}: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(initialCollapsedState);

  const toggleCollapsed = () => updateCollapsedState(!collapsed);

  const updateCollapsedState = (newState: boolean) => {
    setCookie(STORAGE_KEYS.APP_SIDEBAR_COLLAPSED, JSON.stringify(newState));
    setCollapsed(newState);
  };

  const sidebarProps = useMemo(
    (): SidebarProps => ({ toggleCollapsed }),
    [toggleCollapsed],
  );

  return (
    <aside
      className={cn(
        'sticky overflow-y-auto w-10 transition-[width] border-r border-r-border bg-sidebar pt-2.5',
        className,
        collapsed ? collapsedSidebarWidthClass : 'w-72',
      )}
    >
      {collapsed ? (
        <CollapsedSidebar {...sidebarProps} />
      ) : (
        <ExpandedSidebar {...sidebarProps} />
      )}
    </aside>
  );
};

interface SidebarProps {
  toggleCollapsed: VoidFunction;
}

const CollapsedSidebar = ({ toggleCollapsed }: SidebarProps) => {
  return (
    <div
      className={cn(
        collapsedSidebarMaxWidthClass,
        'group w-full flex items-center justify-center',
      )}
    >
      <button onClick={toggleCollapsed}>
        <Image
          className='group-hover:hidden'
          alt={APP_NAME}
          width={APP_LOGO_SIZE}
          height={APP_LOGO_SIZE}
          src={appLogo}
        />
      </button>

      <Button
        onClick={toggleCollapsed}
        className={cn('hidden', 'group-hover:flex')}
        size='icon'
        variant='outline'
      >
        <ArrowRightFromLine />
      </Button>
    </div>
  );
};

const ExpandedSidebar = ({ toggleCollapsed }: SidebarProps) => {
  return (
    <>
      <div className='flex items-center justify-between sticky top-0 bg-sidebar pr-2'>
        <div className='flex items-center'>
          <div
            className={cn(
              collapsedSidebarWidthClass,
              'flex items-center justify-center',
            )}
          >
            <Image
              alt={APP_NAME}
              width={APP_LOGO_SIZE}
              height={APP_LOGO_SIZE}
              src={appLogo}
            />
          </div>

          <div className='text-primary font-medium truncate'>{APP_NAME}</div>
        </div>

        <Button onClick={toggleCollapsed} size='icon' variant='outline'>
          <ArrowLeftFromLine />
        </Button>
      </div>

      <nav>
        <ul>
          <li></li>
        </ul>
      </nav>
    </>
  );
};
