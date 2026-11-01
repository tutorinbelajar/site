'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<'loading'|'ok'|'denied'>('loading');

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login?next=/admin'); return; }
      const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
      if (!active) return;
      if (!data) { setState('denied'); return; }
      setState('ok');
    })();
    return () => { active = false; };
  }, [router]);

  if (state === 'loading') return <div className="notice">Memeriksa akses admin…</div>;
  if (state === 'denied') return <div className="notice">Akun ini belum terdaftar sebagai admin Tutorin. Tambahkan user ID akun ke tabel <code>admin_users</code> di Supabase.</div>;
  return <>{children}</>;
}
