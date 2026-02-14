import { useTranslations } from 'next-intl';

export default function Index() {
  const t = useTranslations();

  return <div>{t('validation.password.tooShort', { length: 6 })}</div>;
}
