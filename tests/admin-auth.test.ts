import { describe, expect, it } from 'vitest';
import { isAdminRequestAuthorized } from '@/lib/admin-auth';

describe('Admin API authorization', () => {
  it('requires the configured secret through a header or HttpOnly session cookie', () => {
    const previous = process.env.ADMIN_SECRET_KEY;
    process.env.ADMIN_SECRET_KEY = 'test-admin-secret';

    expect(isAdminRequestAuthorized(new Request('https://example.test/api/admin/leads'))).toBe(false);
    expect(isAdminRequestAuthorized(new Request('https://example.test/api/admin/leads', { headers: { 'x-admin-secret': 'wrong' } }))).toBe(false);
    expect(isAdminRequestAuthorized(new Request('https://example.test/api/admin/leads', { headers: { 'x-admin-secret': 'test-admin-secret' } }))).toBe(true);
    expect(isAdminRequestAuthorized(new Request('https://example.test/api/admin/leads', { headers: { cookie: 'carbonscout_admin_session=test-admin-secret' } }))).toBe(true);

    if (previous === undefined) delete process.env.ADMIN_SECRET_KEY;
    else process.env.ADMIN_SECRET_KEY = previous;
  });
});
