import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = 'carbonscout_admin_session';

export function proxy(request: NextRequest) {
  const expectedSecret = process.env.ADMIN_SECRET_KEY;
  const sessionSecret = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!expectedSecret || sessionSecret !== expectedSecret) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin', '/admin/projects/:path*'] };
