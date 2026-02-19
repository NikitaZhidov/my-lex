'use client';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { SupportedLanguage } from '@my-lex/locales';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@my-lex/ui';

import { getLocaleLabel, SUPPORTED_LOCALES } from '../utils';

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();

  const changeLocale = (newLocale: SupportedLanguage) => {
    if (newLocale === locale) {
      return;
    }

    document.cookie = `locale=${newLocale}`;

    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <Globe />
          {getLocaleLabel(locale)}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {SUPPORTED_LOCALES.map(loc => (
          <DropdownMenuItem key={loc} onClick={() => changeLocale(loc)}>
            {getLocaleLabel(loc)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
