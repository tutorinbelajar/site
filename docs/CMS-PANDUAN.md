# Panduan CMS Tutorin untuk Admin

## Mengakses CMS
- Buka `/login`, masuk menggunakan akun yang sudah dibuat di Supabase Auth.
- Akun harus memiliki baris pada tabel `admin_users`.
- Setelah login, buka `/admin`.

## Mengelola Privat dan Kelas
Buka **CMS → Program → Tambah Program**. Isi:
- Nama program: misalnya `Privat Reguler SD 1–3 Nasional`
- Slug: unik, huruf kecil dan tanda hubung, misalnya `privat-reguler-sd-1-3`
- Kategori: `privat` atau `kelas`
- Jenjang, subject, ringkasan, deskripsi
- Status `draft` untuk menyimpan belum tampil, `published` untuk tampil di website
- Fasilitas: satu baris untuk setiap poin
- Paket: satu baris dengan format `Nama paket | jumlah pertemuan | harga`
- Urutan: angka kecil muncul lebih dahulu

Untuk harga promo kelas, tuliskan tanggal periode di nama paket, contoh:
`Early Bird · 1 Okt–30 Nov 2026 | 8 | 119000`

## Mengelola ebook
Buka **CMS → Ebook** dan masukkan judul, deskripsi, kategori, harga, URL cover, serta URL produk Lynk.id. Bila URL produk spesifik tidak dimasukkan, website memakai toko umum `https://lynk.id/tutorinbelajar`.

## Mengelola Tryout
Tryout dikelola di CMS → Tryout. Jangan ubah status menjadi published sebelum paket dan URL pengerjaan benar-benar siap. Halaman publik menampilkan status pengembangan jika tidak ada tryout published.

## Mengelola Blog
Buka CMS → Blog. Isi judul, slug, excerpt, isi artikel, kategori, gambar cover, SEO, dan status publikasi.


## Pendaftaran Tryout dan kode peserta
Setelah menjalankan migration `0005_tutorin_tryout_registration.sql`, admin dapat membuka `/admin/registrations` atau klik menu **Pendaftar TO** di CMS.
- Peserta membuat akun dari `/register`, kemudian mengirim formulir pendaftaran dari halaman detail tryout.
- Status awal pendaftar adalah `pending`.
- Admin dapat menekan **Setujui & buat kode** atau **Tolak**.
- Saat status berubah menjadi `approved`, database menerbitkan kode unik `TKA26-XXXXXXXX` secara otomatis.
- Kode peserta tampil kembali pada akun peserta di halaman detail tryout.
- Isi harga pada CMS → Tryout terlebih dahulu. CMS tidak mengizinkan pendaftaran dibuka jika harga belum diisi.

## Pendaftaran TO dengan pembayaran manual
Lihat `docs/TRYOUT-PAYMENT-ACCESS.md`. Admin perlu mengisi harga dan instruksi pembayaran pada CMS Tryout. Verifikasi bukti pembayaran di CMS > Pendaftar TO, lalu setujui pendaftar untuk menerbitkan kode akses.
