import { type AuditEntity } from '@my-lex/shared-models';

export const sortByCreatedAt =
  (reverse = false) =>
  (a: Pick<AuditEntity, 'createdAt'>, b: Pick<AuditEntity, 'createdAt'>) => {
    const dateA =
      a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt ?? 0);

    const dateB =
      b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt ?? 0);

    return reverse
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  };
