import { ZodIssueBase, ZodIssueCode, ZodTooSmallIssue } from 'zod/v3';

export const isZodTooSmallIssue = (
  issue: ZodIssueBase,
): issue is ZodTooSmallIssue => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (issue as any)?.code === ZodIssueCode.too_small;
};
