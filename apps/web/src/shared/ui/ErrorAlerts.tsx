import { AlertCircleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@my-lex/ui';

import { ParsedError } from '../utils';

export interface ErrorAlertsProps {
  parsedError?: ParsedError;
  className?: string;
}

const ErrorAlerts = ({ parsedError, className }: ErrorAlertsProps) => {
  if (!parsedError) {
    return <></>;
  }

  return (
    <div className={className}>
      <Alert variant='destructive'>
        <AlertCircleIcon />

        {parsedError.title && <AlertTitle>{parsedError.title}</AlertTitle>}

        {parsedError.errors?.map(err => (
          <AlertDescription>{err}</AlertDescription>
        ))}
      </Alert>
    </div>
  );
};

export default ErrorAlerts;
