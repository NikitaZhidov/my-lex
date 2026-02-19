import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import LoginForm from '@/features/auth/components/LoginForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('auth.login'),
    description: t('auth.loginDescription'),
  };
}

const LoginPage = () => {
  return <LoginForm className='min-w-sm' />;
};

export default LoginPage;
