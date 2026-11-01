'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function SignupForm() {
  const router=useRouter(); const params=useSearchParams();
  const [name,setName]=useState(''); const [phone,setPhone]=useState('');
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const [notice,setNotice]=useState('');

  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true);setError('');setNotice('');
    const sb=createClient();
    const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:name.trim(),phone:phone.trim()}}});
    if(error) setError(error.message);
    else if(data.session) {
      const next=params.get('next'); router.replace(next&&next.startsWith('/')?next:'/');router.refresh();
    } else {
      setNotice('Akun berhasil dibuat. Periksa email untuk konfirmasi, lalu masuk dan lanjutkan pendaftaran tryout.');
    }
    setLoading(false);
  }

  return <div className="section"><div className="container" style={{maxWidth:560}}>
    <form className="card form-card" onSubmit={submit}>
      <div><div className="eyebrow">Akun Tutorin</div><h1>Buat akun murid/orangtua</h1><p style={{color:'var(--muted)'}}>Akun digunakan untuk mengirim pendaftaran tryout dan melihat status konfirmasi admin.</p></div>
      {error&&<div className="notice error-notice">{error}</div>}{notice&&<div className="notice">{notice}</div>}
      <label className="label">Nama lengkap<input className="input" value={name} onChange={e=>setName(e.target.value)} required autoComplete="name"/></label>
      <label className="label">Nomor WhatsApp<input className="input" value={phone} onChange={e=>setPhone(e.target.value)} required inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx"/></label>
      <label className="label">Email<input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></label>
      <label className="label">Password<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="Minimal 8 karakter"/></label>
      <button className="button button-primary" disabled={loading}>{loading?'Membuat akun…':'Buat akun'}</button>
      <p style={{color:'var(--muted)',textAlign:'center'}}>Sudah punya akun? <Link href={`/login${params.get('next')?`?next=${encodeURIComponent(params.get('next')!)}`:''}`} style={{color:'var(--green)',fontWeight:800}}>Masuk</Link></p>
    </form>
  </div></div>;
}
