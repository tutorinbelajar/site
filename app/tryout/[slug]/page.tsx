import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import TryoutRegistration from '@/components/TryoutRegistration';

type TryoutDetail = {
  id?: string;
  slug: string;
  title: string;
  category: string | null;
  level: string | null;
  subject: string | null;
  duration_minutes: number | null;
  question_count: number | null;
  price: number | null;
  registration_open: boolean;
  instructions?: string | null;
  payment_instructions: string | null;
};

const sample: TryoutDetail = {
  slug: 'tka-sd-matematika-paket-2',
  title: 'Tryout TKA SD Matematika — Paket 2',
  category: 'TKA SD',
  level: 'SD',
  subject: 'Matematika',
  duration_minutes: 75,
  question_count: 30,
  price: null,
  registration_open: false,
  instructions: null,
  payment_instructions: null,
};

export default async function TryoutDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sb = createPublicClient();

  const { data } = sb
    ? await sb
        .from('tutorin_tryouts')
        .select(
          'id,slug,title,category,level,subject,duration_minutes,question_count,price,registration_open,instructions,payment_instructions',
        )
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()
    : { data: null };

  // Keep the sample fallback structurally identical to the Supabase row.
  const item: TryoutDetail | null = data
    ? (data as TryoutDetail)
    : slug === sample.slug
      ? sample
      : null;

  if (!item) notFound();

  return (
    <div className="section">
      <div className="container">
        <div className="detail-hero">
          <div className="eyebrow">
            {item.category || 'Tryout'} · {item.subject || 'Matematika'}
          </div>
          <h1>{item.title}</h1>
          <p>
            Simulasi TKA untuk membantu murid berlatih, mengatur waktu, dan
            mengevaluasi pemahaman. Paket ini memuat {item.question_count || 30}{' '}
            soal dengan durasi {item.duration_minutes || 75} menit.
          </p>
          <div className="tags">
            <span>{item.level || 'SD'}</span>
            <span>{item.question_count || 30} soal</span>
            <span>{item.duration_minutes || 75} menit</span>
          </div>
          <div className="tryout-price detail-price">
            <small>Biaya pendaftaran</small>
            <strong>
              {Number(item.price) > 0
                ? `Rp ${Number(item.price).toLocaleString('id-ID')}`
                : 'Harga akan diumumkan'}
            </strong>
          </div>
        </div>

        <div className="grid-2 tryout-detail-grid">
          <div className="card">
            <h2>Yang perlu diketahui</h2>
            <ul>
              <li>Buat akun Tutorin sebelum mendaftar.</li>
              <li>Pendaftaran diperiksa dan dikonfirmasi oleh admin.</li>
              <li>Setelah disetujui, peserta menerima kode unik.</li>
              <li>Informasi pelaksanaan akan diberikan melalui kontak yang didaftarkan.</li>
            </ul>
            <p>
              {item.instructions ||
                'Latihan dirancang untuk menjadi sarana evaluasi kesiapan, bukan jaminan hasil ujian.'}
            </p>
          </div>
          <TryoutRegistration tryout={item as any} />
        </div>
      </div>
    </div>
  );
}
