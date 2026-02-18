import { FetchClient } from './fetch-client';

// HOT TODO: add theme handler

// HOT TODO: add guards to routes
// HOT TODO: handle the root "/"" route
// HOT TODO: add google authorization
// HOT TODO: add langauge switcher

// HOT TODO: fix the error in the console

export const api = new FetchClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  options: {
    credentials: 'include',
  },
});
