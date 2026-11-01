import Link from 'next/link';
import { SectionTitle } from '@/components/SectionTitle';
import { createPublicClient } from '@/lib/supabase/public';

const storeUrl = 'https://lynk.id/tutorinbelajar';

export default async function EbookPage() {
  const sb = createPublicClient();
  const { data: ebooks, error } = sb
    ? await sb.from('tutorin_ebooks').select('id,slug,title,description,category,price,purchase_url,cover_url')
        .eq('status','published').order('created_at',{ascending:false})
    : { data: null, error: null };

  return <div className="section"><div className="container">
    <SectionTitle eyebrow="Kategori 03 · Ebook" title="Latihan yang bisa dibawa ke mana saja"
      description="Pilih ebook latihan soal dan pembahasan sesuai kebutuhan belajar. Setiap kartu menampilkan cover, kategori, harga, dan tombol checkout menuju Lynk.id." />
    <div className="ebook-intro">
      <div><span className="badge">Belajar mandiri</span><h2>Butuh latihan tambahan yang lebih fleksibel?</h2><p>Gunakan ebook Tutorin untuk berlatih sesuai waktu sendiri. Detail produk dan transaksi tersedia di toko resmi Tutorin.</p></div>
      <a className="button button-primary" href={storeUrl} target="_blank" rel="noreferrer">Buka toko Lynk.id ↗</a>
    </div>
    {error ? <div className="notice">Katalog ebook belum dapat dimuat. Silakan kunjungi toko Lynk.id Tutorin.</div>
      : ebooks?.length ? <div className="grid-3 ebook-grid">{ebooks.map(e=><article className="card ebook-card" key={e.id}>
        <div className="ebook-cover">{e.cover_url ? <img src={e.cover_url} alt={`Cover ebook ${e.title}`} loading="lazy" /> : <div className="ebook-cover-fallback"><span>TUTORIN</span><strong>{e.title}</strong><small>{e.category||'Ebook latihan soal'}</small></div>}</div>
        <div className="ebook-card-body"><span className="badge">{e.category||'Ebook'}</span><h3>{e.title}</h3><p>{e.description||'Ebook latihan soal dan materi pendukung belajar.'}</p>
        <div className="ebook-buy-row"><div><small>Harga</small><div className="price">{Number(e.price)>0 ? `Rp ${Number(e.price).toLocaleString('id-ID')}` : 'Lihat di toko'}</div></div>
        <a className="button button-primary" href={e.purchase_url||storeUrl} target="_blank" rel="noreferrer">Checkout ↗</a></div>
        </div></article>)}</div>
      : <div className="empty-state"><h3>{sb ? 'Katalog ebook sedang disiapkan' : 'Katalog ebook segera tersedia'}</h3><p>{sb ? 'Admin dapat menambahkan judul, cover, kategori, harga, dan tautan checkout melalui CMS. Untuk sekarang, ebook dapat dilihat di toko resmi.' : 'Katalog CMS akan tampil setelah konfigurasi database selesai. Ebook dapat dilihat dan dibeli melalui toko Tutorin di Lynk.id.'}</p><a className="button button-primary" href={storeUrl} target="_blank" rel="noreferrer">Lihat ebook di Lynk.id ↗</a></div>}
  </div></div>;
}
