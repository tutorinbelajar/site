import Link from 'next/link';
import { SectionTitle } from '@/components/SectionTitle';
import { createPublicClient } from '@/lib/supabase/public';

const storeUrl = 'https://lynk.id/tutorinbelajar';

export default async function EbookPage() {
  const sb = createPublicClient();
  const { data: ebooks, error } = await sb.from('tutorin_ebooks')
    .select('id,slug,title,description,category,price,purchase_url,cover_url')
    .eq('status','published').order('created_at',{ascending:false});

  return <div className="section"><div className="container">
    <SectionTitle eyebrow="Kategori 03 · Ebook" title="Ebook latihan soal Tutorin"
      description="Kumpulan ebook latihan soal dan materi pendukung untuk belajar mandiri. Pembelian ebook saat ini dilakukan melalui toko Tutorin di Lynk.id." />
    <div className="card" style={{marginBottom:24}}>
      <h3>Temukan ebook dan lakukan pembelian di Lynk.id</h3>
      <p>Jelajahi koleksi ebook yang tersedia di toko resmi Tutorin. Daftar ebook yang dipublikasikan dari CMS akan tampil di bawah.</p>
      <a className="button button-primary" href={storeUrl} target="_blank" rel="noreferrer">Buka toko ebook Tutorin ↗</a>
    </div>
    {error ? <div className="notice">Katalog ebook belum dapat dimuat. Silakan kunjungi toko Lynk.id Tutorin.</div>
      : ebooks?.length ? <div className="grid-3">{ebooks.map(e=><article className="card" key={e.id}>
        {e.cover_url && <img src={e.cover_url} alt={`Cover ${e.title}`} style={{borderRadius:14,marginBottom:16}} />}
        <span className="badge">{e.category||'Ebook'}</span><h3>{e.title}</h3><p>{e.description||''}</p>
        {Number(e.price)>0 && <div className="price">Rp {Number(e.price).toLocaleString('id-ID')}</div>}
        <a className="button button-primary" href={e.purchase_url||storeUrl} target="_blank" rel="noreferrer">Beli Ebook ↗</a>
      </article>)}</div>
      : <div className="empty-state"><h3>Katalog ebook sedang disiapkan</h3><p>Untuk melihat ebook yang tersedia dan membeli, kunjungi toko Tutorin di Lynk.id.</p><a className="button button-primary" href={storeUrl} target="_blank" rel="noreferrer">Lihat ebook di Lynk.id ↗</a></div>}
  </div></div>;
}
