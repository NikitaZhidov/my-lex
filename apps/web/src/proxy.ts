import { NextRequest, NextResponse } from 'next/server';

import { APP_ROUTES, AUTH_ROUTES } from './constants';
import { authService } from './features/auth/services/auth.service';

// TODO: SHOULD BE IN SYNC WITH SESSION_NAME from env
const SESSION_NAME = 'session';

export async function proxy(request: NextRequest) {
  const url = request.url;
  const hasSession = request.cookies.get(SESSION_NAME)?.value;

  if (url.includes(APP_ROUTES.LOGOUT)) {
    const res = NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));

    await authService.logout().catch(console.error);

    // TODO: change this if the api is on another domain
    const domain = new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? '').hostname;

    res.cookies.set({
      name: SESSION_NAME,
      value: '',
      domain,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
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
