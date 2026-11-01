import Link from 'next/link';
import { SectionTitle } from '@/components/SectionTitle';
import { createPublicClient } from '@/lib/supabase/public';

const sample = {
  slug: 'tka-sd-matematika-paket-2',
  title: 'Tryout TKA SD Matematika — Paket 2',
  category: 'TKA SD',
  level: 'SD',
  subject: 'Matematika',
  duration_minutes: 75,
  question_count: 30,
  price: null,
  status: 'published',
};

export default async function TryoutPage() {
  const sb = createPublicClient();
  const { data: tryouts, error } = sb
    ? await sb.from('tutorin_tryouts')
        .select('id,slug,title,category,level,subject,duration_minutes,question_count,price,registration_open')
        .eq('status','published').order('created_at',{ascending:false})
    : { data: null, error: null };
  const list = tryouts?.length ? tryouts : [sample];

  return <div className="section"><div className="container">
    <SectionTitle eyebrow="Kategori 04 · Tryout" title="Latihan terukur untuk mengenali kesiapan"
      description="Tryout membantu murid berlatih dalam batas waktu dan melihat materi yang perlu diperkuat. Pendaftaran memerlukan akun Tutorin dan konfirmasi admin." />
    {error && <div className="notice">Katalog belum dapat dimuat dari database. Informasi contoh ditampilkan sementara.</div>}
    <div className="grid-3 tryout-grid">{list.map((t:any)=><article className="card tryout-card" key={t.id||t.slug}>
      <span className="badge">{t.category||'TRYOUT'}</span><h3>{t.title}</h3>
      <p>Persiapan TKA dengan latihan dan evaluasi terarah.</p>
      <div className="tags"><span>{t.level||'SD'}</span><span>{t.subject||'Matematika'}</span><span>{t.question_count||30} soal</span><span>{t.duration_minutes||75} menit</span></div>
      <div className="tryout-price"><small>Biaya pendaftaran</small><strong>{Number(t.price)>0?`Rp ${Number(t.price).toLocaleString('id-ID')}`:'Harga akan diumumkan'}</strong></div>
      <Link className="button button-primary" href={`/tryout/${t.slug}`}>{t.registration_open===false?'Lihat detail':'Lihat detail & daftar →'}</Link>
    </article>)}</div>
    <div className="notice tryout-note"><strong>Alur pendaftaran:</strong> buat akun atau masuk, kirim pendaftaran, tunggu konfirmasi admin, lalu gunakan kode peserta unik yang diterbitkan setelah disetujui.</div>
  </div></div>;
}
