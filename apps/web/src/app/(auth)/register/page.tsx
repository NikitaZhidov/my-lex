import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import RegisterForm from '@/features/auth/components/RegisterForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('auth.signUp'),
    description: t('auth.registerDescription'),
  };
}

const RegisterPage = () => {
  return <RegisterForm className='min-w-sm' />;
};

export default RegisterPage;
