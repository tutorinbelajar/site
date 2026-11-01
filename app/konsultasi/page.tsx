import { SectionTitle } from '@/components/SectionTitle';
export default function ConsultationPage() {
  const phone = process.env.NEXT_PUBLIC_TUTORIN_WHATSAPP || '';
  const message = encodeURIComponent('Halo Tutorin, saya ingin konsultasi program belajar. Jenjang: ____. Target: ____. Kebutuhan: ____.');
  const wa = phone ? `https://wa.me/${phone.replace(/\\D/g,'')}?text=${message}` : '';
  return <section className="section"><div className="container">
    <SectionTitle eyebrow="Konsultasi Tutorin" title="Bantu kami memahami kebutuhan belajarmu"
      description="Sampaikan jenjang, target, dan kesulitan belajar. Tim Tutorin dapat membantu menjelaskan pilihan program yang tersedia." />
    <div className="grid-2">
      <article className="card"><h3>Informasi yang bisa disiapkan</h3><p>• Jenjang atau kelas saat ini<br/>• Target belajar atau ujian<br/>• Materi yang terasa sulit<br/>• Preferensi jadwal dan bentuk belajar</p></article>
      <article className="card"><h3>Hubungi tim Tutorin</h3><p>Nomor WhatsApp layanan diatur melalui environment variable agar mudah diperbarui tanpa mengubah komponen.</p>
        {wa ? <a className="button button-primary" href={wa} target="_blank" rel="noreferrer">Konsultasi via WhatsApp ↗</a> : <div className="notice">Admin perlu mengisi NEXT_PUBLIC_TUTORIN_WHATSAPP pada pengaturan environment Vercel untuk mengaktifkan tombol WhatsApp.</div>}
      </article>
    </div>
  </div></section>;
}
