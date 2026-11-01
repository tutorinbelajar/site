# Tutorin Bimbel — Website & CMS

Website Tutorin berbasis Next.js App Router, TypeScript, dan Supabase. Versi ini mengutamakan informasi yang jelas untuk orangtua/murid dan pengelolaan konten melalui CMS.

## Empat kategori layanan

1. **Privat** — akademik reguler nasional/internasional, TKA SD/SMP/SMA, SNBT/Mandiri/IUP, Olimpiade SD/SMP/SMA, dan akademik mahasiswa.
2. **Kelas** — untuk saat ini Kelas Intensif Matematika TKA SD (kelas 6) dan TKA SMP (kelas 9).
3. **Ebook** — ebook latihan soal dan materi pendukung; tombol pembelian diarahkan ke toko Tutorin di Lynk.id.
4. **Tryout** — kategori ditampilkan sebagai sedang dikembangkan. CMS sudah dapat mengelola metadata tryout ketika siap dipublikasikan.

Blog tetap tersedia sebagai konten editorial, bukan kategori layanan bimbel.

## CMS yang tersedia

Admin dapat membuka `/admin` setelah login dan memiliki izin di tabel `admin_users`.

- **Program** (`/admin/programs`): tambah/edit/hapus program Privat dan Kelas, slug, deskripsi, jenjang, mata pelajaran, fasilitas, paket, harga, jumlah pertemuan, urutan, dan status publikasi.
- **Ebook** (`/admin/ebooks`): kelola judul, deskripsi, kategori, cover, harga, link pembelian Lynk.id, serta status publikasi.
- **Tryout** (`/admin/tryouts`): kelola metadata paket tryout dan status.
- **Blog** (`/admin/articles`): kelola artikel, cover, excerpt, isi, SEO, dan status.
- Dashboard menghitung konten dari Supabase.

Konten berstatus `published` yang dapat dibaca publik akan tampil di halaman terkait. Simpan sebagai `draft` untuk menyusun konten tanpa menampilkannya ke pengunjung.

## Menjalankan lokal

Persyaratan: Node.js 22.x dan npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Isi environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_TUTORIN_WHATSAPP=628xxxxxxxxxx
```

`NEXT_PUBLIC_TUTORIN_WHATSAPP` adalah nomor WhatsApp resmi Tutorin dalam format internasional, tanpa `+`, spasi, atau tanda baca. Isi sebelum mengaktifkan tombol konsultasi.

## Setup Supabase

1. Buka SQL Editor di Supabase project yang dipakai website.
2. Jalankan migration secara berurutan:
   - `supabase/migrations/0001_tutorin_core.sql`
   - `supabase/migrations/0002_tutorin_cms.sql`
   - `supabase/migrations/0003_remove_cms_question_bank.sql`
   - `supabase/migrations/0004_tutorin_full_catalog.sql`
3. Pastikan akun admin telah terdaftar pada tabel `admin_users` sesuai struktur migration.
4. Jalankan aplikasi dan login. CMS akan mengelola konten pada database project tersebut.

Migration 0004 memasukkan katalog awal 17 program Privat dan dua kelas TKA Matematika yang sudah diinformasikan, termasuk paket harga. Data awal ini dapat diedit dari CMS. Harga kelas mengikuti poster yang diberikan dan harus ditinjau kembali ketika periode harga berubah.

## Ebook Lynk.id

Halaman `/ebook` membaca kartu ebook published dari tabel `tutorin_ebooks`. Jika field `purchase_url` kosong, tombol pembelian menggunakan:

`https://lynk.id/tutorinbelajar`

Admin dapat memasukkan URL produk Lynk.id per ebook agar pembelian dari card menuju produk yang tepat. Jika URL produk belum ada, pengguna diarahkan ke toko umum.

## Build dan deploy

```bash
npm run typecheck
npm run build
```

Deploy sebagai project Next.js (misalnya Vercel). Tambahkan environment variables yang sama pada project deployment. Perubahan schema database harus diterapkan di Supabase terlebih dahulu.

## Catatan

- CMS membutuhkan Supabase yang terkonfigurasi; jangan mengunggah service-role key ke environment variable `NEXT_PUBLIC_*`.
- Cek ketersediaan tutor, nomor WhatsApp, jadwal, dan harga sebelum publikasi.
- Tryout ditampilkan sebagai in-development sampai program benar-benar siap.

## Catatan deployment Vercel dan Supabase

Halaman publik (`/bimbel`, `/ebook`, `/tryout`, dan `/blog`) sekarang memiliki fallback ketika Supabase belum dikonfigurasi, sehingga build Next.js tidak gagal hanya karena environment variable belum tersedia. Dalam kondisi ini, katalog yang bergantung pada CMS ditampilkan sebagai kosong/placeholder; tautan toko ebook Lynk.id tetap tersedia.

Agar CMS dan katalog dinamis berfungsi di production, tambahkan Environment Variables berikut di Vercel → Project Settings → Environment Variables, untuk Production, Preview, dan Development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_TUTORIN_WHATSAPP` (opsional untuk tombol konsultasi)

Setelah menyimpan variabel, lakukan Redeploy. Jangan masukkan `service_role` key ke variabel `NEXT_PUBLIC_*` atau ke source code.
