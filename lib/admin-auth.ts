import { timingSafeEqual } from 'crypto';

const ADMIN_SESSION_COOKIE = 'carbonscout_admin_session';

function secretsMatch(candidate: string | undefined): boolean {
  const expected = process.env.ADMIN_SECRET_KEY;
  if (!expected || !candidate) return false;
  const expectedBuffer = Buffer.from(expected);
  const candidateBuffer = Buffer.from(candidate);
  return expectedBuffer.length === candidateBuffer.length && timingSafeEqual(expectedBuffer, candidateBuffer);
}

export function isAdminRequestAuthorized(request: Request): boolean {
  const cookie = request.headers.get('cookie');
  const session = cookie?.match(new RegExp(`(?:^|; )${ADMIN_SESSION_COOKIE}=([^;]+)`))?.[1];
  return secretsMatch(request.headers.get('x-admin-secret') || session);
}

export function adminSessionCookieName(): string {
  return ADMIN_SESSION_COOKIE;
}
