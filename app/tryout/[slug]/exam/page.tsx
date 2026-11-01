import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import TryoutExamAccess from '@/components/tryout/TryoutExamAccess';

export default async function TryoutExamPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const sb=createPublicClient();
  const {data}=sb ? await sb.from('tutorin_tryouts').select('id,slug,title,status').eq('slug',slug).eq('status','published').maybeSingle() : {data:null};
  if(!data) notFound();
  return <div className="section"><div className="container" style={{maxWidth:900}}>
    <div className="eyebrow">Ruang ujian Tutorin</div><h1>{data.title}</h1>
    <p style={{color:'var(--muted)'}}>Masukkan kode akses yang diberikan admin setelah pendaftaran dan pembayaran Anda dikonfirmasi. Kode akan diperiksa bersama akun yang digunakan.</p>
    <TryoutExamAccess slug={slug}/>
  </div></div>;
}
