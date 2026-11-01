# Tutorin Tryout Source

Satu folder = satu paket TO. Source TO berada di `public/tryouts/` agar dapat disajikan langsung oleh deployment Vercel.

```text
public/tryouts/
├── _template/
├── tka/
│   ├── sd/
│   │   ├── paket-01/
│   │   └── paket-02/
│   ├── smp/
│   └── sma/
├── snbt/
└── latihan/
```

Jangan membuat bank soal pusat di CMS. Soal, pembahasan, konfigurasi, asset, dan entry page berada di folder paket TO masing-masing.

CMS dapat membuat folder baru dari `_template` melalui GitHub API. Setelah folder dibuat, metadata TO disimpan di Supabase.
