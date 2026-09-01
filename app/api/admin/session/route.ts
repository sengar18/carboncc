import { NextRequest, NextResponse } from 'next/server';
import { adminSessionCookieName, isAdminRequestAuthorized } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminSessionCookieName(), request.headers.get('x-admin-secret')!, {
    httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8,
  });
  return response;
}
