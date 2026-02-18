import { _Translator } from 'next-intl';
import { toast } from 'sonner';

import { ApiError } from '@/lib';

export const toastApiErrorHandler =
  (t: _Translator) => (error: Error | ApiError) => {
    if (error instanceof ApiError) {
      const hasErrorMessages = Boolean(error.errors?.length);
      const errorTitle = hasErrorMessages ? undefined : t(error.message);

      toast.error(
        <>
          {errorTitle && <div>{errorTitle}</div>}
          {hasErrorMessages &&
            error.errors?.map(err => (
              <div key={err.message}>{t(err.message, err.params)}</div>
            ))}
        </>,
      );
    } else {
      toast.error(t('exceptions.somethingWentWrong'));
    }
  };
