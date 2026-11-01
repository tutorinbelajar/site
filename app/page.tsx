import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";
import { getPublishedPrograms } from "@/lib/programs";

const categories = [
  { icon: "◎", title: "Privat", description: "Pendampingan personal untuk kebutuhan akademik, TKA, seleksi masuk kampus, olimpiade, hingga perkuliahan.", href: "/bimbel?kategori=privat", tag: "SD hingga mahasiswa" },
  { icon: "▦", title: "Kelas", description: "Kelas intensif terstruktur. Saat ini tersedia Kelas Matematika TKA SD dan TKA SMP.", href: "/bimbel?kategori=kelas", tag: "TKA Matematika SD & SMP" },
  { icon: "▤", title: "Ebook", description: "Kumpulan ebook latihan soal dan materi pendukung. Pembelian diarahkan ke toko resmi Tutorin di Lynk.id.", href: "/ebook", tag: "Belajar mandiri" },
  { icon: "✓", title: "Tryout", description: "Sarana latihan dan evaluasi kemampuan. Katalog tryout publik sedang dalam pengembangan.", href: "/tryout", tag: "Sedang dikembangkan" },
];

export default async function Home() {
  const programs = await getPublishedPrograms().catch(() => []);
  const featured = programs.slice(0, 3);
  return <>
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">Tutorin · Belajar lebih terarah</div>
          <h1>Bukan sekadar belajar. Temukan pendampingan yang sesuai kebutuhan dan targetmu.</h1>
          <p>Setiap murid punya kebutuhan belajar yang berbeda. Tutorin membantu orangtua dan murid memahami pilihan layanan, menentukan langkah, dan memulai belajar dengan lebih terarah.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/bimbel">Jelajahi program</Link>
            <Link className="button button-light" href="/konsultasi">Konsultasi</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="eyebrow">Empat kategori layanan</div>
          <h3>Pilih bentuk belajar yang tepat.</h3>
          {categories.map((item, i) => <div className="mini-stat" key={item.title}><span>0{i+1}</span><strong>{item.title}</strong></div>)}
        </div>
      </div>
    </section>

    <section className="section" id="kategori">
      <div className="container">
        <SectionTitle eyebrow="LAYANAN TUTORIN" title="Empat kategori. Satu tujuan: belajar lebih terarah." description="Informasi layanan dibuat jelas agar orangtua dan murid tahu apa yang tersedia, bagaimana memulainya, dan ke mana harus melangkah." />
        <div className="grid-2">
          {categories.map((item, i) => <article className={`category-card ${i % 2 ? "alt" : ""}`} key={item.title}>
            <div className="eyebrow">{`0${i+1} · KATEGORI`}</div><div className="why-icon">{item.icon}</div>
            <h3>{item.title}</h3><p>{item.description}</p><div className="tags"><span>{item.tag}</span></div>
            <Link className="text-link" href={item.href}>Pelajari layanan →</Link>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section why-section">
      <div className="container">
        <SectionTitle eyebrow="MULAI DARI KEBUTUHAN" title="Tidak harus langsung tahu program yang tepat." description="Kami ingin membantu murid dan orangtua memahami kebutuhan terlebih dahulu, lalu memilih bentuk belajar yang paling masuk akal." />
        <div className="method-grid">
          {[
            ["01", "Kenali kebutuhan", "Apa target murid? Materi apa yang terasa sulit? Kapan dukungan dibutuhkan?"],
            ["02", "Pilih bentuk layanan", "Privat untuk pendampingan personal, Kelas untuk belajar terstruktur, Ebook untuk belajar mandiri."],
            ["03", "Konsultasi bila perlu", "Diskusikan jenjang, target, jadwal, dan pilihan program bersama tim Tutorin."],
            ["04", "Mulai dan evaluasi", "Jalankan program dan tinjau perkembangan serta langkah belajar berikutnya."],
          ].map(([no, title, body]) => <article className="method-card" key={no}><span>{no}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </div>
    </section>

    {featured.length > 0 && <section className="section">
      <div className="container"><SectionTitle eyebrow="PROGRAM TERPILIH" title="Program yang dipublikasikan Tutorin" description="Program di bawah dikelola dari CMS. Informasi dapat diperbarui oleh admin tanpa mengubah halaman website." />
        <div className="grid-3">{featured.map((program: any) => <article className="card program-card" key={program.slug}><span className="badge">{program.category === "privat" ? "PRIVAT" : "KELAS"}</span><h3>{program.name}</h3><p>{program.shortDescription}</p><Link className="text-link" href={`/program/${program.category}/${program.slug}`}>Detail program →</Link></article>)}</div>
        <div className="center-action"><Link className="button button-primary" href="/bimbel">Lihat katalog program →</Link></div>
      </div>
    </section>}

    <section className="section">
      <div className="container"><div className="category-card">
        <div className="eyebrow" style={{ color: "#bfe6ce" }}>Belum yakin memilih?</div>
        <h2 style={{ fontSize: 38, margin: "8px 0" }}>Ceritakan kebutuhan belajarmu.</h2>
        <p>Tim Tutorin dapat membantu menjelaskan program yang tersedia dan langkah berikutnya.</p>
        <Link className="button button-light" href="/konsultasi">Konsultasi dengan Tutorin</Link>
      </div></div>
    </section>
  </>;
}
