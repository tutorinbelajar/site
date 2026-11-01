'use client';

import { useState } from 'react';

export default function TryoutExamAccess({slug}:{slug:string}) {
  const [code,setCode]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [authorized,setAuthorized]=useState(false);

  async function enter(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const response=await fetch(`/api/tryout/exam/${encodeURIComponent(slug)}`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:code.trim().toUpperCase()})
      });
      const result=await response.json();
      if(!response.ok) setError(result.error||'Kode akses tidak dapat digunakan.');
      else setAuthorized(true);
    } catch { setError('Koneksi terganggu. Coba kembali.'); }
    setBusy(false);
  }

  if(authorized) return <div className="card" style={{padding:0,overflow:'hidden'}}>
    <div style={{padding:16,background:'var(--surface-soft)',display:'flex',justifyContent:'space-between',gap:12,alignItems:'center'}}><strong>Akses terverifikasi</strong><span className="badge">Ruang ujian</span></div>
    <iframe title="Tryout Tutorin" src={`/api/tryout/exam/${encodeURIComponent(slug)}`} style={{width:'100%',height:'min(82vh,1000px)',border:0,background:'#fff'}} allow="fullscreen" />
  </div>;

  return <form className="card form-card" onSubmit={enter} style={{maxWidth:560}}>
    <h2>Masukkan kode akses</h2>
    <label className="label">Kode unik dari admin
      <input className="input" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} required autoCapitalize="characters" autoComplete="off" placeholder="Contoh: TKA26-AB12CD34" />
    </label>
    {error&&<div className="notice error-notice">{error}</div>}
    <button className="button button-primary" disabled={busy||!code.trim()}>{busy?'Memeriksa kode…':'Verifikasi & masuk ujian'}</button>
    <small style={{color:'var(--muted)'}}>Kode hanya berlaku untuk akun peserta yang telah disetujui. Jangan membagikan kode kepada orang lain.</small>
  </form>;
}
