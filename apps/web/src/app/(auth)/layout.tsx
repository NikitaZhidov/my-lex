import { PropsWithChildren } from 'react';

import { LocaleSwitcher, ThemeToggle } from '@/shared/components';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex items-center justify-center h-screen relative'>
      <div className='absolute inset-x-0 top-0 p-4 flex items-center justify-end gap-3'>
        <LocaleSwitcher />

        <ThemeToggle />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
