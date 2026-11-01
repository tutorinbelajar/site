import { SectionTitle } from '@/components/SectionTitle';
import { createPublicClient } from '@/lib/supabase/public';

export default async function TryoutPage() {
  const sb = createPublicClient();
  const { data: tryouts, error } = await sb.from('tutorin_tryouts')
    .select('id,slug,title,category,level,subject,duration_minutes,question_count,deployment_url')
    .eq('status','published').order('created_at',{ascending:false});

  return <div className="section"><div className="container">
    <SectionTitle eyebrow="Kategori 04 · Tryout" title="Tryout Tutorin sedang dikembangkan"
      description="Tryout akan menjadi ruang latihan dan evaluasi kemampuan. Katalog publik belum dibuka sampai paket siap digunakan." />
    {error ? <div className="notice">Informasi tryout belum dapat dimuat. Saat ini kategori ini masih dalam pengembangan.</div>
      : tryouts?.length ? <div className="grid-3">{tryouts.map(t=><article className="card" key={t.id}>
        <span className="badge">{t.category||'TRYOUT'}</span><h3>{t.title}</h3>
        <div className="tags"><span>{t.level||'Umum'}</span>{t.subject&&<span>{t.subject}</span>}
          <span>{t.question_count||0} soal</span><span>{t.duration_minutes||0} menit</span></div>
        {t.deployment_url ? <a className="button button-primary" href={t.deployment_url} target="_blank" rel="noreferrer">Mulai Tryout →</a>
          : <span className="badge">Sedang dikembangkan</span>}
      </article>)}</div>
      : <div className="card"><span className="badge">Coming soon</span><h3>Fitur Tryout sedang dalam pengembangan.</h3><p>Untuk saat ini, silakan jelajahi layanan Privat, Kelas, atau Ebook Tutorin.</p></div>}
  </div></div>;
}
