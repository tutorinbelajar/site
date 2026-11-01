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
- `NEXT_PUBLIC_TUTORIN_WHATSAPP` (nomor WhatsApp admin Tutorin untuk konfirmasi pembayaran TO dan tombol konsultasi; format angka internasional, misalnya `62...`, tanpa `+`)

Setelah menyimpan variabel, lakukan Redeploy. Jangan masukkan `service_role` key ke variabel `NEXT_PUBLIC_*` atau ke source code.


## Pendaftaran Tryout, pembayaran manual, dan kode peserta
Jalankan migration berurutan `0001` sampai `0007` di Supabase SQL Editor. Migration `0005` menambah contoh Tryout TKA SD Matematika Paket 2 (30 soal, 75 menit) dan pendaftaran; migration `0006` adalah versi lama alur upload bukti; migration `0007_tutorin_whatsapp_manual_payment.sql` menonaktifkan alur upload bukti dan menggantinya dengan konfirmasi WhatsApp serta verifikasi mutasi rekening oleh admin.

Tidak ada upload bukti pembayaran dalam alur terbaru. Peserta transfer, tekan tombol konfirmasi WhatsApp, lalu admin mencocokkan transaksi di mutasi rekening dan memilih **Verifikasi & setujui** di CMS. Kode akses unik terbit setelah disetujui. Setel `NEXT_PUBLIC_TUTORIN_WHATSAPP` di Vercel agar tombol WhatsApp mengarah ke nomor admin yang benar. Panduan lengkap ada di `docs/TRYOUT-PAYMENT-ACCESS.md` dan `docs/TRYOUT-PAYMENT-OPS.md`.

Harga Paket 2 sengaja dibiarkan belum ditetapkan karena nominal belum diberikan. Masukkan harga dan instruksi transfer resmi melalui CMS → Tryout sebelum membuka pendaftaran berbayar.
