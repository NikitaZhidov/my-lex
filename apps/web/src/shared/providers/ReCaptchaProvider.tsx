'use client';

import { useTheme } from 'next-themes';
import { PropsWithChildren } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { getRecaptchaSiteKey } from '@/features/recaptcha';

export const ReCaptchaProvider = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();
  const key = getRecaptchaSiteKey();

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={key}
      container={{
        parameters: { theme: theme === 'light' ? 'light' : 'dark' },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};
