'use client';

import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@my-lex/ui';

import { cn, setCookie } from '../utils';

import { APP_NAME, STORAGE_KEYS } from '@/constants';

export interface AppSidebarProps {
  className?: string;
  initialCollapsedState: boolean;
}

export const AppSidebar = ({
  className,
  initialCollapsedState,
}: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(initialCollapsedState);

  const toggleCollapsed = () => {
    const newState = !collapsed;

    setCookie(STORAGE_KEYS.APP_SIDEBAR_COLLAPSED, JSON.stringify(newState));
    setCollapsed(newState);
  };

  return (
    <aside
      className={cn(
        'sticky overflow-y-auto w-10 transition-[width] border-r border-r-border bg-sidebar',
        className,
        collapsed ? 'w-14' : 'w-72',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between py-3 sticky top-0 bg-sidebar',
          collapsed ? 'px-2' : 'px-4',
        )}
      >
        {!collapsed && (
          <div className='text-primary font-bold truncate'>{APP_NAME}</div>
        )}
        <Button onClick={toggleCollapsed} size='icon' variant='outline'>
          {collapsed ? <ArrowRightFromLine /> : <ArrowLeftFromLine />}
        </Button>
      </div>

      <nav>
        <ul>
          <li></li>
        </ul>
      </nav>
    </aside>
  );
};
