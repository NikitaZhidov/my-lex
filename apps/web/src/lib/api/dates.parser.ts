const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

export const parseDates = <T>(obj: T): T => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string' && ISO_DATE_REGEX.test(obj)) {
    return new Date(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(parseDates) as T;
  }

  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, parseDates(v)]),
    ) as T;
  }

  return obj;
};
