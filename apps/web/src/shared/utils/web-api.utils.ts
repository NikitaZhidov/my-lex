export const setCookie = (
  name: string,
  value: string,
  path = '/',
  maxAge = 31536000,
) => {
  document.cookie = `${name}=${value}; path=${path}; max-age=${maxAge}`;
};
