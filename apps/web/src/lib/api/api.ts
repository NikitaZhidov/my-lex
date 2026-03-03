import { parseDates } from './dates.parser';
import { FetchClient } from './fetch-client';
import { isServer } from '@/shared/utils';

const getApiBaseUrl = () => {
  if (isServer()) {
    return (
      process.env.API_INTERNAL_BASE_URL ??
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      ''
    );
  }

  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.API_INTERNAL_BASE_URL ??
    ''
  );
};

export const api = new FetchClient({
  baseUrl: getApiBaseUrl(),
  jsonParsers: [parseDates],
  optionsGetter: async () => {
    if (isServer()) {
      const { cookies } = await import('next/headers');
      const clientCookies = await cookies();
      return {
        headers: {
          Cookie: clientCookies.toString(),
        },
      };
    } else {
      return {
        credentials: 'include',
      };
    }
  },
});
