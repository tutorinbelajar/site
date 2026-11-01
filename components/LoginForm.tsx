'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const sb = createClient();
    const { error: authError } = await sb.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
    } else {
      const next = params.get('next');
      router.replace(next && next.startsWith('/') ? next : '/');
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <form className="card form-card" onSubmit={submit}>
          <div>
            <div className="eyebrow">Akun Tutorin</div>
            <h1>Masuk</h1>
            <p style={{ color: 'var(--muted)' }}>
              Masuk ke akun Tutorin untuk mendaftar tryout atau mengakses layanan yang memerlukan akun.
            </p>
          </div>

          {error && <div className="notice error-notice">{error}</div>}

          <label className="label">
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@email.com"
            />
          </label>

          <label className="label">
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </label>

          <button className="button button-primary" disabled={loading}>
            {loading ? 'Memproses…' : 'Masuk'}
          </button>
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Belum punya akun? <Link href={`/register${params.get('next') ? `?next=${encodeURIComponent(params.get('next')!)}` : ''}`} style={{ color: 'var(--green)', fontWeight: 800 }}>Buat akun</Link></p>
        </form>
      </div>
    </div>
  );
}
