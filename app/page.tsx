import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { getPublishedPrograms } from "@/lib/programs";

const services = [
  { icon: "◎", number: "01", title: "Privat", tagline: "Pendampingan personal", description: "Belajar satu lawan satu dengan materi, ritme, dan target yang disesuaikan. Untuk pelajaran sekolah, TKA, SNBT/mandiri/IUP, olimpiade, hingga mata kuliah.", href: "/bimbel?kategori=privat", label: "SD · SMP · SMA · Mahasiswa" },
  { icon: "▦", number: "02", title: "Kelas", tagline: "Belajar bersama, tetap terarah", description: "Kelas intensif dengan agenda dan latihan terstruktur. Saat ini tersedia Kelas Matematika TKA SD dan TKA SMP.", href: "/bimbel?kategori=kelas", label: "TKA Matematika SD & SMP" },
  { icon: "▤", number: "03", title: "Ebook", tagline: "Latihan fleksibel kapan saja", description: "Ebook latihan soal dan pembahasan untuk murid yang ingin berlatih mandiri. Pilih judul di katalog, lalu checkout melalui Lynk.id.", href: "/ebook", label: "Belajar mandiri" },
  { icon: "✓", number: "04", title: "Tryout", tagline: "Ukur kesiapan, bukan sekadar menebak", description: "Simulasi ujian untuk berlatih dalam batas waktu dan mengenali bagian yang perlu diperkuat. Paket TKA SD Matematika mulai disiapkan.", href: "/tryout", label: "Latihan & evaluasi" },
];

const challenges = [
  ["Anak sudah belajar, tetapi belum paham", "Mencari tahu bagian yang belum dikuasai lebih penting daripada menambah jam belajar tanpa arah."],
  ["Orangtua sulit melihat progres", "Pendampingan perlu memiliki target dan umpan balik agar keluarga tahu apa yang sudah berkembang dan apa langkah berikutnya."],
  ["Bingung memilih les atau metode belajar", "Kebutuhan setiap murid berbeda. Pilihan layanan sebaiknya mengikuti tujuan, kesulitan, dan ritme belajar."],
];

export default async function Home() {
  const programs = await getPublishedPrograms().catch(() => []);
  const featured = programs.slice(0, 3);
  return <>
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">Tutorin · Bimbel yang berangkat dari kebutuhan murid</div>
          <h1>Sudah belajar, tapi hasil belum bergerak?</h1>
          <p className="hero-lead">Anak mungkin tidak membutuhkan lebih banyak latihan yang sama—melainkan pendampingan yang tepat, strategi yang jelas, dan evaluasi yang membantu menemukan bagian yang belum dipahami.</p>
          <p>Tutorin membantu orangtua dan murid memilih cara belajar yang sesuai kebutuhan dan target, dari pendampingan privat hingga kelas, ebook, dan tryout.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/bimbel">Temukan program bimbel</Link>
            <Link className="button button-light" href="/konsultasi">Konsultasi kebutuhan belajar</Link>
          </div>
          <div className="hero-trust">Didirikan oleh alumni ITB · Tutor dari ITB, UI, UNPAD, dan kampus unggulan lainnya</div>
        </div>
        <div className="hero-card hero-proof-card">
          <div className="eyebrow">Belajar tidak harus menebak</div>
          <h3>Mulai dari pertanyaan yang tepat.</h3>
          <div className="hero-prompt"><span>01</span><div><strong>Apa target belajarnya?</strong><small>Nilai sekolah, TKA, seleksi, atau pemahaman konsep.</small></div></div>
          <div className="hero-prompt"><span>02</span><div><strong>Bagian mana yang masih sulit?</strong><small>Temukan kebutuhan sebelum memilih program.</small></div></div>
          <div className="hero-prompt"><span>03</span><div><strong>Bagaimana progres dievaluasi?</strong><small>Belajar dengan arah dan langkah berikutnya.</small></div></div>
        </div>
      </div>
    </section>

    <section className="section" id="tantangan">
      <div className="container">
        <SectionTitle eyebrow="KAMI MEMAHAMI TANTANGAN BELAJAR" title="Bukan selalu karena anak kurang berusaha." description="Ketika hasil belum sesuai harapan, murid dan orangtua perlu memahami penyebabnya—bukan sekadar menambah beban belajar." />
        <div className="grid-3">
          {challenges.map(([title, body], i) => <article className="card challenge-card" key={title}><span className="badge">TANTANGAN 0{i+1}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </div>
    </section>

    <section className="section why-section" id="tentang">
      <div className="container">
        <div className="founder-panel">
          <div className="eyebrow">Mengapa Tutorin hadir</div>
          <h2>Belajar perlu pendampingan yang memahami murid, bukan hanya materi.</h2>
          <p>Tutorin didirikan oleh alumni Institut Teknologi Bandung (ITB) dengan keyakinan bahwa setiap murid punya kebutuhan, titik awal, dan cara memahami pelajaran yang berbeda. Kami ingin membuat pendampingan akademik yang lebih terarah—agar murid tidak hanya mengejar jawaban, tetapi membangun pemahaman dan percaya diri.</p>
          <p>Tutor berasal dari kampus-kampus unggulan seperti ITB, Universitas Indonesia (UI), Universitas Padjadjaran (UNPAD), serta kampus favorit lainnya. Yang kami utamakan adalah kecocokan tutor dengan kebutuhan murid dan proses belajar yang jelas.</p>
        </div>
        <div className="why-grid why-grid-compact">
          <article className="why-card"><span className="why-number">01 / PERSONAL</span><div className="why-icon">◎</div><h3>Mulai dari kebutuhan murid</h3><p>Materi, target, dan ritme belajar disesuaikan dengan kondisi murid—bukan pendekatan seragam untuk semua.</p></article>
          <article className="why-card"><span className="why-number">02 / TERARAH</span><div className="why-icon">↗</div><h3>Ada tujuan dan langkah</h3><p>Belajar dibangun dari target yang jelas, latihan yang relevan, serta evaluasi untuk menentukan langkah selanjutnya.</p></article>
          <article className="why-card"><span className="why-number">03 / KOLABORATIF</span><div className="why-icon">♡</div><h3>Orangtua ikut memahami progres</h3><p>Informasi perkembangan membantu orangtua melihat proses belajar dan mendukung anak dengan lebih tepat.</p></article>
        </div>
      </div>
    </section>

    <section className="section" id="layanan">
      <div className="container">
        <SectionTitle eyebrow="LAYANAN TUTORIN" title="Empat cara belajar. Pilih yang sesuai kebutuhan." description="Jelajahi layanan Tutorin berdasarkan tujuan dan cara belajar yang paling cocok untuk murid." />
        <div className="grid-2 service-grid">
          {services.map((item) => <article className="category-card service-card" key={item.title}>
            <div className="service-card-top"><span className="service-number">{item.number}</span><span className="why-icon">{item.icon}</span></div>
            <div className="eyebrow service-tagline">{item.tagline}</div><h3>{item.title}</h3><p>{item.description}</p>
            <div className="tags"><span>{item.label}</span></div>
            <Link className="text-link" href={item.href}>Jelajahi {item.title} →</Link>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="CARA MEMULAI" title="Tidak harus langsung tahu program yang tepat." description="Kami membantu Anda mengambil langkah yang masuk akal—dari mengenali kebutuhan sampai memilih bentuk belajar." />
        <div className="method-grid method-grid-four">
          {[
            ["01", "Ceritakan kebutuhan", "Target, jenjang, kesulitan, dan jadwal belajar."],
            ["02", "Pilih bentuk belajar", "Privat, Kelas, Ebook, atau Tryout sesuai kebutuhan."],
            ["03", "Mulai dengan arah", "Pilih program dan jalankan proses belajar."],
            ["04", "Tinjau perkembangan", "Evaluasi hasil dan tentukan langkah berikutnya."],
          ].map(([no, title, body]) => <article className="method-card" key={no}><span>{no}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </div>
    </section>

    {featured.length > 0 && <section className="section">
      <div className="container"><SectionTitle eyebrow="PROGRAM TERPILIH" title="Program yang tersedia saat ini" description="Katalog program dikelola melalui CMS. Informasi layanan dan paket dapat diperbarui oleh admin." />
        <div className="grid-3">{featured.map((program: any) => <article className="card program-card" key={program.slug}><span className="badge">{program.category === "privat" ? "PRIVAT" : "KELAS"}</span><h3>{program.name}</h3><p>{program.shortDescription}</p><Link className="text-link" href={`/program/${program.category}/${program.slug}`}>Lihat detail →</Link></article>)}</div>
        <div className="center-action"><Link className="button button-primary" href="/bimbel">Lihat semua program →</Link></div>
      </div>
    </section>}

    <section className="section">
      <div className="container"><div className="closing-cta">
        <div><div className="eyebrow">Langkah pertama bisa sederhana</div><h2>Ceritakan kebutuhan belajar anak. Kami bantu arahkan.</h2><p>Diskusikan jenjang, target, materi yang terasa sulit, dan pilihan layanan bersama tim Tutorin.</p></div>
        <div className="hero-actions"><Link className="button button-primary" href="/konsultasi">Konsultasi dengan Tutorin</Link><Link className="button button-light" href="/bimbel">Lihat program</Link></div>
      </div></div>
    </section>
  </>;
}
