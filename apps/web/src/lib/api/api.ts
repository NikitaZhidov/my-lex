import { FetchClient } from './fetch-client';

// HOT TODO: take apiUrl from .env
// HOT TODO: add error handlers to useLoginMutation (with translating)

export const api = new FetchClient({
  baseUrl: process.env.API_BASE_URL ?? 'http://localhost:3001/api',
  options: {
    credentials: 'include',
  },
});
