'use client';

import { ArrowLeftFromLine, BrainCog, FileStack } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@my-lex/ui';

import appLogo from '../../../public/app-logo/app-logo-sm.png';
import {
  DEFAULT_SMALL_SCREEN_THRESHOLD,
  useBlockBodyScroll,
  useIsSmallScreen,
} from '../hooks';
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
const collapsedSidebarMinWidthClass = 'min-w-14';

export const AppSidebar = ({
  className,
  initialCollapsedState,
}: AppSidebarProps) => {
  const pathname = usePathname();
  const t = useTranslations();

  const [collapsed, _setCollapsed] = useState(initialCollapsedState);

  const isSmallScreen = useIsSmallScreen();

  useEffect(() => {
    if (window.innerWidth < DEFAULT_SMALL_SCREEN_THRESHOLD && !collapsed) {
      updateCollapsedState(true);
    }
  }, []);

  useBlockBodyScroll(!collapsed && isSmallScreen);

  const toggleCollapsed = () => updateCollapsedState(!collapsed);
  const logoClick = () => {
    if (collapsed) {
      updateCollapsedState(false);
    }
  };

  const updateCollapsedState = (newState: boolean) => {
    setCookie(STORAGE_KEYS.APP_SIDEBAR_COLLAPSED, JSON.stringify(newState));
    _setCollapsed(newState);
  };

  const backdropClick = () => updateCollapsedState(true);

  const linkClick = () => {
    if (isSmallScreen && !collapsed) {
      updateCollapsedState(true);
    }
  };

  return (
    <>
      {!collapsed && (
        <div
          onClick={backdropClick}
          className='bg-black/40 fixed inset-0 z-40 block md:hidden'
        ></div>
      )}
      <aside
        className={cn(
          'overflow-visible w-10 border-r border-r-border bg-background pt-2.5 max-h-screen h-screen top-0 fixed md:sticky z-50',
          collapsedSidebarMinWidthClass,
          className,
          collapsed
            ? `${collapsedSidebarWidthClass} -translate-x-full md:translate-x-0 transition-[width,translate,min-width]`
            : 'w-60 min-w-60 translate-x-0 transition-[width,min-width]',
        )}
      >
        <div className='flex flex-col gap-4 relative'>
          <div className='flex items-center justify-between sticky top-0 pr-2'>
            <div className='flex items-center'>
              <div
                className={cn(
                  collapsedSidebarWidthClass,
                  'flex items-center justify-center transition-none',
                )}
              >
                <button className='cursor-pointer' onClick={logoClick}>
                  <Image
                    alt={APP_NAME}
                    width={APP_LOGO_SIZE}
                    height={APP_LOGO_SIZE}
                    src={appLogo}
                  />
                </button>
              </div>

              {collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeIn' }}
                  animate={{ opacity: 1 }}
                  className='absolute -right-full top-0 md:hidden inline-block cursor-pointer'
                  onClick={toggleCollapsed}
                >
                  <Image
                    alt={APP_NAME}
                    width={APP_LOGO_SIZE}
                    height={APP_LOGO_SIZE}
                    src={appLogo}
                  />
                </motion.button>
              )}

              {!collapsed && (
                <div className='text-primary font-medium truncate'>
                  {APP_NAME}
                </div>
              )}
            </div>

            {!collapsed && (
              <Button onClick={toggleCollapsed} size='icon' variant='outline'>
                <ArrowLeftFromLine />
              </Button>
            )}
          </div>

          <nav>
            <ul className='flex flex-col gap-2 px-2'>
              {SIDEBAR_ROUTES.map(route => {
                return (
                  <li key={route.title} className='w-full'>
                    <Link
                      onClick={linkClick}
                      className='w-full'
                      href={route.href}
                    >
                      <Button
                        className='w-full justify-start'
                        variant={
                          pathname === route.href ? 'secondary' : 'ghost'
                        }
                      >
                        <route.icon />
                        <span
                          className={cn('hidden', collapsed ? '' : 'inline')}
                        >
                          {t(route.title)}
                        </span>
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};
