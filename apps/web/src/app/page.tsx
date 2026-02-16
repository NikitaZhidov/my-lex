import { useTranslations } from 'next-intl';

import { Button } from '@my-lex/ui';

export default function Index() {
  const t = useTranslations();

  return (
    <div className='text-3xl'>
      <div className='font-light text-sm'>
        {t('validation.password.tooShort', { length: 6 })}
      </div>
      <div>
        <Button>Button</Button>
      </div>
    </div>
  );
}
