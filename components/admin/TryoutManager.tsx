'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Row = Record<string, any> & { id: string };
const empty = { title:'', slug:'', category:'tka', level:'sd', subject:'', duration_minutes:60, question_count:40, status:'draft' };

export default function TryoutManager() {
  const sb = createClient();
  const [rows,setRows] = useState<Row[]>([]);
  const [form,setForm] = useState<any|null>(null);
  const [edit,setEdit] = useState<Row|null>(null);
  const [q,setQ] = useState('');
  const [error,setError] = useState('');
  const [saving,setSaving] = useState(false);
  const [creating,setCreating] = useState(false);

  async function load(){
    const {data,error} = await sb.from('tutorin_tryouts').select('*').order('created_at',{ascending:false});
    if(error) setError(error.message); else setRows(data||[]);
  }
  useEffect(()=>{load()},[]);
  const update=(key:string,value:any)=>setForm((v:any)=>({...v,[key]:value}));
  function startNew(){setEdit(null);setForm({...empty});setError('');}
  function startEdit(r:Row){setEdit(r);setForm({...r});setError('');}

  async function save(e:React.FormEvent){
    e.preventDefault(); if(!form) return; setSaving(true); setError('');
    const payload = {...form}; delete payload.id; delete payload.created_at; delete payload.updated_at;
    if(payload.status==='published' && !payload.published_at) payload.published_at=new Date().toISOString();
    const result = edit ? await sb.from('tutorin_tryouts').update(payload).eq('id',edit.id) : await sb.from('tutorin_tryouts').insert(payload);
    if(result.error) setError(result.error.message); else {setForm(null);setEdit(null);await load();}
    setSaving(false);
  }
  async function remove(row:Row){
    if(!confirm(`Hapus metadata TO “${row.title}”?`)) return;
    const {error}=await sb.from('tutorin_tryouts').delete().eq('id',row.id);
    if(error)setError(error.message);else await load();
  }
  async function createFromTemplate(){
    if(!form) return; setCreating(true); setError('');
    const {data:{session}}=await sb.auth.getSession();
    if(!session){setError('Sesi login tidak ditemukan. Login ulang.');setCreating(false);return;}
    const response=await fetch('/api/admin/tryouts/create',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify(form)});
    const result=await response.json();
    if(!response.ok){setError(result.error||'Gagal membuat TO dari template.');setCreating(false);return;}
    setForm(null);setEdit(null);await load();setCreating(false);
    alert(`TO berhasil dibuat di ${result.folder}`);
  }
  const filtered=rows.filter(r=>!q||[r.title,r.slug,r.category,r.level,r.subject,r.github_path].some(v=>String(v??'').toLowerCase().includes(q.toLowerCase())));

  return <>
    <div className="section-title"><div className="eyebrow">CMS / Tryout</div><h1>Tryout</h1><p>CMS hanya mengelola katalog dan metadata. Setiap TO mempunyai folder GitHub sendiri yang berisi source code, soal, pembahasan, konfigurasi, dan aset.</p></div>
    {error&&<div className="notice error-notice">{error}</div>}
    <div className="cms-toolbar"><input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari tryout…"/><button className="button button-primary" onClick={startNew}>+ Buat TO Baru</button></div>
    {form&&<form className="card cms-form" onSubmit={save}>
      <div className="cms-form-head"><div><div className="eyebrow">{edit?'EDIT METADATA':'TO BARU'}</div><h3>{edit?'Ubah metadata':'Buat tryout baru'}</h3></div><button type="button" className="button button-light" onClick={()=>setForm(null)}>Tutup</button></div>
      <div className="cms-form-grid">
        <label className="label">Judul<input className="input" value={form.title||''} required onChange={e=>update('title',e.target.value)}/></label>
        <label className="label">Slug<input className="input" value={form.slug||''} required onChange={e=>update('slug',e.target.value)}/></label>
        <label className="label">Kategori<input className="input" value={form.category||''} placeholder="tka / snbt / latihan" onChange={e=>update('category',e.target.value)}/></label>
        <label className="label">Level<input className="input" value={form.level||''} placeholder="sd / smp / sma" onChange={e=>update('level',e.target.value)}/></label>
        <label className="label">Subject<input className="input" value={form.subject||''} onChange={e=>update('subject',e.target.value)}/></label>
        <label className="label">Durasi (menit)<input className="input" type="number" value={form.duration_minutes??0} onChange={e=>update('duration_minutes',Number(e.target.value))}/></label>
        <label className="label">Jumlah soal<input className="input" type="number" value={form.question_count??0} onChange={e=>update('question_count',Number(e.target.value))}/></label>
        <label className="label">Status<select className="input" value={form.status||'draft'} onChange={e=>update('status',e.target.value)}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
      </div>
      <div className="notice" style={{marginTop:16}}>Path otomatis: <strong>tryouts/{String(form.category||'kategori').toLowerCase()}/{String(form.level||'level').toLowerCase()}/{String(form.slug||'slug').toLowerCase()}</strong></div>
      <div className="cms-actions"><button className="button button-primary" disabled={saving}>{saving?'Menyimpan…':edit?'Simpan Metadata':'Simpan Metadata'}</button>{!edit&&<button type="button" className="button button-light" disabled={creating} onClick={createFromTemplate}>{creating?'Membuat folder…':'Buat dari Template + GitHub'}</button>}<button type="button" className="button button-light" onClick={()=>setForm(null)}>Batal</button></div>
    </form>}
    <div className="table-wrap"><table className="table"><thead><tr><th>Nama</th><th>Kategori</th><th>Level</th><th>Soal</th><th>GitHub</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{filtered.map(r=><tr key={r.id}><td><strong>{r.title}</strong><br/><small>{r.slug}</small></td><td>{r.category||'—'}</td><td>{r.level||'—'}</td><td>{r.question_count??0}</td><td>{r.github_path||'—'}</td><td><span className="badge">{r.status}</span></td><td><div className="row-actions"><button className="button button-light" onClick={()=>startEdit(r)}>Edit</button><button className="button button-danger" onClick={()=>remove(r)}>Hapus</button></div></td></tr>)}{filtered.length===0&&<tr><td colSpan={7}>Belum ada TO.</td></tr>}</tbody></table></div>
  </>;
}
