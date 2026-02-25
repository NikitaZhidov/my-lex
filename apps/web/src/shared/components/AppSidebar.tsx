'use client';

import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  BrainCog,
  FileStack,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

import { Button } from '@my-lex/ui';

import appLogo from '../../../public/app-logo/app-logo-sm.png';
import { cn, setCookie } from '../utils';

import { APP_NAME, APP_ROUTES, HOME_ROUTE, STORAGE_KEYS } from '@/constants';

export interface AppSidebarProps {
  className?: string;
  initialCollapsedState: boolean;
}

interface SidebarRoute {
  title: string;
  icon: typeof FileStack;
  href: string;
}

const SIDEBAR_ROUTES: SidebarRoute[] = [
  {
    title: 'common.AIVocabulary',
    icon: BrainCog,
    href: HOME_ROUTE,
  },
  {
    title: 'common.Flashcards',
    icon: FileStack,
    href: APP_ROUTES.FLASHCARDS,
  },
];

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
        'sticky overflow-y-auto w-10 transition-[width] border-r border-r-border bg-background pt-2.5',
        className,
        collapsed ? collapsedSidebarWidthClass : 'w-60',
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
  const pathname = usePathname();

  return (
    <div className='flex flex-col gap-4'>
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

      <nav>
        <ul className='flex flex-col gap-2 px-2'>
          {SIDEBAR_ROUTES.map(route => {
            return (
              <li key={route.title} className='w-10'>
                <Link className='w-full' href={route.href}>
                  <Button
                    className='w-full'
                    size='icon'
                    variant={pathname === route.href ? 'secondary' : 'ghost'}
                  >
                    <route.icon />
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

const ExpandedSidebar = ({ toggleCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between sticky top-0 pr-2'>
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
        <ul className='flex flex-col gap-2 px-2'>
          {SIDEBAR_ROUTES.map(route => {
            return (
              <li key={route.title} className='w-full'>
                <Link className='w-full' href={route.href}>
                  <Button
                    className='w-full justify-start'
                    variant={pathname === route.href ? 'secondary' : 'ghost'}
                  >
                    <route.icon />
                    {t(route.title)}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
