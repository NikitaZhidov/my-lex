import { FetchClient } from './fetch-client';

// HOT TODO: add theme handler

// HOT TODO: add guards to routes
// HOT TODO: add google authorization
// HOT TODO: add register form
// HOT TODO: add langauge switcher

export const api = new FetchClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  options: {
    credentials: 'include',
  },
});
