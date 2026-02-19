import { FetchClient } from './fetch-client';

export const api = new FetchClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  options: {
    credentials: 'include',
  },
});
