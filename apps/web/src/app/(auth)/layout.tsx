import { PropsWithChildren } from 'react';

import { LocaleSwitcher, ThemeToggle } from '@/shared/components';
import { ReCaptchaProvider } from '@/shared/providers/ReCaptchaProvider';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex items-center justify-center min-h-screen py-4 relative'>
      <div className='absolute inset-x-0 top-0 p-4 flex items-center justify-end gap-3'>
        <LocaleSwitcher />

        <ThemeToggle />
      </div>
      <ReCaptchaProvider>{children}</ReCaptchaProvider>
    </div>
  );
};

export default AuthLayout;
