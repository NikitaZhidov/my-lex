import { cookies } from 'next/headers';

export const getCookieValue = async (name: string) => {
  const store = await cookies();

  return store.get(name)?.value;
};
