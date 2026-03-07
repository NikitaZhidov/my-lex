import { NextRequest, NextResponse } from 'next/server';

import { APP_ROUTES, AUTH_ROUTES } from './constants';

// TODO: SHOULD BE IN SYNC WITH SESSION_NAME from env
const SESSION_NAME = 'session';

export async function proxy(request: NextRequest) {
  const url = request.url;
  const hasSession = request.cookies.get(SESSION_NAME)?.value;

  if (url.includes(APP_ROUTES.LOGOUT)) {
    const res = NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));

    res.cookies.delete({
      name: SESSION_NAME,
      path: '/',
    });

    return res;
  }

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
