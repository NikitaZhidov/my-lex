export const APP_ROUTES = {
  REGISTER: '/register',
  LOGIN: '/login',
} as const;

type AppRouteValues = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export const AUTH_ROUTES: AppRouteValues[] = [
  APP_ROUTES.LOGIN,
  APP_ROUTES.REGISTER,
];

export const HOME_ROUTE = '/';
