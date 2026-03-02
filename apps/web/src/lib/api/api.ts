import { parseDates } from './dates.parser';
import { FetchClient } from './fetch-client';
import { isServer } from '@/shared/utils';

export const api = new FetchClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
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
