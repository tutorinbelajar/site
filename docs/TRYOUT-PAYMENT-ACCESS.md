# Pendaftaran TO: transfer manual, konfirmasi WhatsApp, dan kode akses

## Alur peserta
1. Peserta membuat akun atau login ke Tutorin.
2. Peserta memilih tryout, mengisi data, dan membuat pendaftaran.
3. Halaman peserta menampilkan harga dan instruksi transfer yang diatur admin di CMS > Tryout.
4. Peserta transfer ke rekening resmi Tutorin.
5. Peserta menekan **Konfirmasi pembayaran via WhatsApp**. Pesan yang terbuka sudah berisi nomor pendaftaran, nama peserta, paket, dan nominal. Peserta menambahkan tanggal/waktu transfer serta nama pengirim rekening.
6. Tidak ada upload bukti pembayaran dan tidak ada file bukti yang disimpan di Supabase.
7. Admin mencocokkan nominal, waktu, dan nama pengirim dengan mutasi rekening. Admin lalu memilih **Verifikasi & setujui** di CMS.
8. Database memvalidasi pembayaran untuk paket berbayar dan menerbitkan kode akses unik setelah persetujuan.
9. Peserta login dengan akun yang sama, memasukkan kode, lalu mengakses ruang TO.

## Konfigurasi
- Jalankan migration `0007_tutorin_whatsapp_manual_payment.sql` setelah migration 0001-0006.
- Atur `NEXT_PUBLIC_TUTORIN_WHATSAPP` di Vercel Environment Variables menggunakan nomor WhatsApp admin dalam format internasional, hanya angka (contoh format Indonesia: `62...`, tanpa tanda `+`).
- Isi harga dan instruksi rekening yang benar pada CMS > Tryout. Jangan buka pendaftaran jika rekening atau nominal belum final.
- Pastikan role admin sudah dikonfigurasi sesuai mekanisme admin Tutorin.

## Prosedur admin
- Gunakan rekening khusus/terpisah untuk pembayaran Tutorin jika memungkinkan.
- Periksa mutasi bank atau dashboard penyedia pembayaran; jangan menganggap pesan WhatsApp sebagai bukti pembayaran.
- Cocokkan nominal, waktu transfer, dan nama pengirim. Catat referensi transaksi di CMS jika tersedia.
- Tekan **Verifikasi & setujui** hanya setelah transaksi ditemukan. Ini akan mengubah status pembayaran dan menerbitkan kode akses.
- Jika transaksi tidak ditemukan, hubungi peserta atau tolak pendaftaran dengan catatan yang jelas.
- Rekonsiliasi transaksi setiap hari.

## Catatan storage
Migration ini menonaktifkan policy upload bukti dan menghapus tabel metadata bukti. Bucket Supabase Storage privat yang dibuat oleh migration sebelumnya sengaja tidak dihapus otomatis agar objek lama tidak hilang tanpa pemeriksaan. Jika pernah ada bukti yang diunggah sebelumnya, admin dapat menghapus objek lama secara manual dari Supabase Storage; fitur baru tidak mengunggah file apa pun.

## Keamanan dan batasan
- Tombol WhatsApp hanya membuka aplikasi/pesan; tidak mengubah status pembayaran otomatis.
- Status resmi disimpan di Supabase dan hanya admin yang mengubah status verifikasi.
- Kode akses hanya dibuat setelah peserta disetujui dan pembayaran paket berbayar berstatus verified.
- WhatsApp tidak otomatis mengirim status balik ke website. Admin perlu menekan verifikasi di CMS.
- Ujian saat ini melayani konten ujian terproteksi; penyimpanan jawaban/nilai dan pengawasan ujian memerlukan implementasi tambahan.
