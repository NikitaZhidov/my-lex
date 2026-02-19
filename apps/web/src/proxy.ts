import { NextRequest, NextResponse } from 'next/server';

import { APP_ROUTES, AUTH_ROUTES } from './constants';

export function proxy(request: NextRequest) {
  const url = request.url;
  const hasSession = request.cookies.get('session')?.value;

  const isAuthPage = AUTH_ROUTES.some(authRoute => url.includes(authRoute));

  if (hasSession) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  if (isAuthPage) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
