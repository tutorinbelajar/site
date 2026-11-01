export type Program = {
  slug: string;
  category: "privat" | "kelas";
  name: string;
  shortDescription: string;
  level: string;
  subject?: string;
  features: string[];
  packages?: { name: string; meetings: number; price: number }[];
};

const privateCatalog = [
  ["Reguler SD 1–3 Nasional", "SD 1–3", "Nasional", 720000, 1280000, 2400000],
  ["Reguler SD 4–6 Nasional", "SD 4–6", "Nasional", 800000, 1440000, 2720000],
  ["Reguler SMP 7–9 Nasional", "SMP 7–9", "Nasional", 960000, 1760000, 3360000],
  ["Reguler SMA 10–12 Nasional", "SMA 10–12", "Nasional", 1120000, 2080000, 4000000],
  ["Reguler SD 1–3 Internasional", "SD 1–3", "Internasional", 1120000, 2080000, 4000000],
  ["Reguler SD 4–6 Internasional", "SD 4–6", "Internasional", 1280000, 2400000, 4640000],
  ["Reguler SMP 7–9 Internasional", "SMP 7–9", "Internasional", 1440000, 2720000, 5280000],
  ["Reguler SMA 10–12 Internasional", "SMA 10–12", "Internasional", 1600000, 3040000, 5920000],
  ["TKA SD", "SD", "TKA", 880000, 1600000, 3040000],
  ["TKA SMP", "SMP", "TKA", 1040000, 1920000, 3680000],
  ["TKA SMA", "SMA", "TKA", 1200000, 2240000, 4320000],
  ["SNBT / Mandiri / IUP", "SMA / Mahasiswa", "Seleksi masuk kampus", 1280000, 2400000, 4640000],
  ["Olimpiade SD", "SD", "Olimpiade", 1280000, 2400000, 4640000],
  ["Olimpiade SMP", "SMP", "Olimpiade", 1440000, 2720000, 5280000],
  ["Olimpiade SMA", "SMA", "Olimpiade", 1600000, 3040000, 5920000],
  ["Kuliah Semester 1–2", "Mahasiswa", "Akademik kampus", 1440000, 2720000, 5280000],
  ["Kuliah Semester 3–akhir", "Mahasiswa", "Akademik kampus", 1600000, 3040000, 5920000],
] as const;

export const programs: Program[] = [
  ...privateCatalog.map(([name, level, subject, boost, growth, mastery]) => ({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    category: "privat" as const,
    name,
    shortDescription: `Pendampingan privat ${name} dengan materi dan target belajar yang disesuaikan dengan kebutuhan murid.`,
    level,
    subject,
    features: ["Jadwal fleksibel", "Materi sesuai kebutuhan", "Tutor sesuai target", "Laporan perkembangan"],
    packages: [
      { name: "Boost", meetings: 8, price: boost },
      { name: "Growth", meetings: 16, price: growth },
      { name: "Mastery", meetings: 32, price: mastery },
    ],
  })),
  {
    slug: "kelas-tka-matematika-sd",
    category: "kelas",
    name: "Kelas Intensif TKA Matematika SD",
    shortDescription: "Kelas persiapan TKA Matematika SD untuk siswa kelas 6 dengan 8 pertemuan intensif.",
    level: "SD · Kelas 6",
    subject: "TKA Matematika",
    features: ["8 pertemuan", "Tutor berpengalaman", "Ebook latihan soal", "2x Try Out", "Grup diskusi WhatsApp", "Evaluasi perkembangan"],
  },
  {
    slug: "kelas-tka-matematika-smp",
    category: "kelas",
    name: "Kelas Intensif TKA Matematika SMP",
    shortDescription: "Kelas persiapan TKA Matematika SMP untuk siswa kelas 9 dengan 8 pertemuan intensif.",
    level: "SMP · Kelas 9",
    subject: "TKA Matematika",
    features: ["8 pertemuan", "Tutor berpengalaman", "Ebook latihan soal", "2x Try Out", "Grup diskusi WhatsApp", "Evaluasi perkembangan"],
  },
];

export const privateProgramCatalog = privateCatalog.map(([name]) => name);
