'use client';

import { useTranslations } from 'next-intl';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Skeleton,
} from '@my-lex/ui';

import { useLogoutMutation } from '@/features/auth/hooks';
import { useProfile } from '@/features/users/hooks';

export const UserProfile = () => {
  const t = useTranslations();
  const { logout, isLoading: isLogoutLoading } = useLogoutMutation();

  const { profile } = useProfile();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {profile ? (
            <Avatar className='border border-accent-foreground'>
              <AvatarImage src={profile.picture ?? undefined} />
              <AvatarFallback>{profile.name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className='h-8 w-8 rounded-full' />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {profile?.name && (
            <DropdownMenuLabel>{profile.name}</DropdownMenuLabel>
          )}

          <DropdownMenuItem
            disabled={isLogoutLoading}
            onClick={() => logout()}
            variant='destructive'
          >
            {t('auth.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
