import { BadRequestException, HttpStatus } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError, ZodIssueBase } from 'zod/v3';

import { isZodTooSmallIssue } from './zod-validation-type.utils';

export interface CustomValidationIssue {
  message: string;
  params: Record<string, unknown>;
}

export const CustomZodValidationPipe: ReturnType<
  typeof createZodValidationPipe
> = createZodValidationPipe({
  createValidationException: (error: unknown) => {
    const validationError = error as ZodError;

    return new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'validation.failed',
      errors: validationError.issues.map(parseZodIssue),
    });
  },
});

const parseZodIssue = <T extends ZodIssueBase>(issue: T) => {
  const patchedIssue: CustomValidationIssue = {
    message: issue.message ?? '',
    params: {
      field: issue.path.join('/'),
    },
  };

  if (isZodTooSmallIssue(issue)) {
    patchedIssue.params['length'] = issue.minimum;
  }

  return patchedIssue;
};
