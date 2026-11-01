'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function AdminDashboard(){
  const [stats,setStats]=useState({traffic:0,visitors:0,programs:0,ebooks:0,tryouts:0,articles:0});
  const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  useEffect(()=>{(async()=>{const sb=createClient();
    const [p,e,t,a,v]=await Promise.all([
      sb.from('tutorin_programs').select('id',{count:'exact',head:true}),
      sb.from('tutorin_ebooks').select('id',{count:'exact',head:true}),
      sb.from('tutorin_tryouts').select('id',{count:'exact',head:true}),
      sb.from('tutorin_articles').select('id',{count:'exact',head:true}),
      sb.from('tutorin_traffic_events').select('visitor_id,event_name').eq('event_name','page_view')
    ]);
    const first=[p,e,t,a,v].find(x=>x.error); if(first?.error)setError(first.error.message);
    const unique=new Set((v.data||[]).map((x:any)=>x.visitor_id).filter(Boolean)).size;
    setStats({traffic:v.data?.length||0,visitors:unique,programs:p.count||0,ebooks:e.count||0,tryouts:t.count||0,articles:a.count||0});setLoading(false);
  })()},[]);
  const cards=[['Traffic',stats.traffic,'page views'],['Pengunjung unik',stats.visitors,'visitor'],['Program',stats.programs,'program'],['Ebook',stats.ebooks,'ebook'],['Tryout',stats.tryouts,'TO'],['Artikel',stats.articles,'artikel']];
  return <><div className="section-title"><div className="eyebrow">CMS Tutorin</div><h1>Dashboard</h1><p>Kelola seluruh katalog Tutorin tanpa mengubah source code. Angka di bawah membaca data langsung dari Supabase.</p></div>{error&&<div className="notice error-notice">{error}</div>}<div className="stat-grid">{cards.map(([label,value,sub])=><div className="stat-card" key={String(label)}><span>{label}</span><strong>{loading?'—':String(value)}</strong><span>{sub}</span></div>)}</div><div className="grid-3 cms-dashboard-links"><div className="card"><div className="eyebrow">PROGRAM</div><h3>Privat & Kelas</h3><p>Kelola seluruh katalog Privat dan Kelas, deskripsi, fasilitas, paket, harga, serta status publikasi.</p><Link className="text-link" href="/admin/programs">Kelola →</Link></div><div className="card"><div className="eyebrow">TRYOUT</div><h3>TO & Latihan</h3><p>Buat paket baru dari template dan arahkan ke folder GitHub terpisah.</p><Link className="text-link" href="/admin/tryouts">Kelola paket →</Link><br/><Link className="text-link" href="/admin/registrations">Konfirmasi pendaftar →</Link></div><div className="card"><div className="eyebrow">KONTEN</div><h3>Blog & Ebook</h3><p>Kelola ebook dengan tautan Lynk.id, artikel blog, dan status publikasi.</p><div className="cms-actions"><Link className="text-link" href="/admin/articles">Blog →</Link><Link className="text-link" href="/admin/ebooks">Ebook →</Link></div></div></div></>;
}
