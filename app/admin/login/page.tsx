'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [secret, setSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null);
    const response = await fetch('/api/admin/session', { method: 'POST', headers: { 'x-admin-secret': secret } });
    if (!response.ok) { setError('Invalid administrator secret.'); return; }
    router.replace(searchParams.get('next') || '/admin');
  }
  return <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-6"><form onSubmit={submit} className="w-full space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div><h1 className="text-xl font-bold text-slate-900">Admin access</h1><p className="mt-1 text-sm text-slate-600">Enter the administrator secret to open the CRM.</p></div><label className="block text-sm font-medium text-slate-700" htmlFor="admin-secret">Administrator secret</label><input id="admin-secret" type="password" required value={secret} onChange={(event) => setSecret(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />{error && <p className="text-sm text-red-700">{error}</p>}<button type="submit" className="w-full rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white">Continue</button></form></main>;
}
