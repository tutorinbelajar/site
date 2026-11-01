# Alur Tryout Tutorin

## Sample package
- Slug: `tka-sd-matematika-paket-2`
- Kategori: TKA SD Matematika
- Jenjang: SD
- Mata pelajaran: Matematika
- Jumlah soal: 30
- Durasi: 75 menit
- Harga: admin menetapkan melalui CMS sebelum membuka pendaftaran.
- File ujian privat: `private-exams/tka-sd-matematika-paket-2/index.html`

## Jalankan migration
Jalankan migration 0005 dan 0006 setelah migration CMS 0001-0004. Migration 0006 menambah petunjuk pembayaran, bukti transfer privat, verifikasi pembayaran admin, validasi kode akses, dan aturan agar pembayaran terverifikasi sebelum peserta berbayar disetujui.

## Alur peserta dan admin
1. Peserta membuat akun atau login.
2. Peserta mendaftar untuk paket TO.
3. Peserta melihat harga serta instruksi pembayaran manual dari CMS.
4. Peserta transfer dan unggah bukti pembayaran di akun.
5. Admin mencocokkan transaksi, kemudian memverifikasi bukti atau meminta unggah ulang.
6. Admin menekan **Setujui & buat kode**. Database membuat kode akses unik.
7. Peserta membuka ruang ujian, memasukkan kode akses, dan kode diverifikasi terhadap akun serta status approved.
8. HTML dan gambar stimulus disajikan melalui route server yang dilindungi login dan kode. HTML dan gambar tidak diletakkan di folder `public`.

## Batasan
Versi ini mengunci akses ke halaman dan aset ujian. Belum ada penyimpanan attempt/jawaban/nilai ke Supabase, anti-cheat, ataupun pencegahan screenshot. Sebelum ujian resmi, tambahkan penyimpanan hasil di server dan audit keamanan.
