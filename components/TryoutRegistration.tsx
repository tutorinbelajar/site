'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase';

type Props = { tryout: { id?: string; slug: string; title: string; category?: string | null; level?: string | null; subject?: string | null; duration_minutes?: number | null; question_count?: number | null; price?: number | null; registration_open?: boolean | null; payment_instructions?: string | null } };
type Registration = { id: string; status: string; unique_code: string | null; created_at?: string; payment_status?: string | null; admin_note?: string | null };

function formatRupiah(value: number) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
}

function getWhatsAppUrl(tryout: Props['tryout'], registration: Registration, name: string, phone: string) {
  const configuredNumber = (process.env.NEXT_PUBLIC_TUTORIN_WHATSAPP || '').replace(/\D/g, '');
  if (!configuredNumber) return null;
  const amount = formatRupiah(Number(tryout.price || 0));
  const message = [
    'Halo Admin Tutorin, saya ingin konfirmasi pembayaran pendaftaran tryout.',
    `Nomor pendaftaran: ${registration.id}`,
    `Nama peserta: ${name}`,
    `WhatsApp peserta/orangtua: ${phone}`,
    `Paket: ${tryout.title}`,
    `Nominal transfer: ${amount}`,
    'Tanggal dan waktu transfer: [isi di sini]',
    'Nama pengirim rekening: [isi di sini]',
    'Mohon bantu cek mutasi rekening. Terima kasih.'
  ].join('\n');
  return `https://wa.me/${configuredNumber}?text=${encodeURIComponent(message)}`;
}

export default function TryoutRegistration({ tryout }: Props) {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [already, setAlready] = useState<Registration | null>(null);

  useEffect(() => {
    (async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        setLoading(false);
        return;
      }
      const sb = createClient();
      setConfigured(true);
      const { data: { user: currentUser } } = await sb.auth.getUser();
      setUser(currentUser);
      setName(currentUser?.user_metadata?.full_name || '');
      setPhone(currentUser?.user_metadata?.phone || '');
      if (currentUser && tryout.id) {
        const { data } = await sb.from('tutorin_tryout_registrations')
          .select('id,status,unique_code,created_at,payment_status,admin_note')
          .eq('tryout_id', tryout.id).eq('user_id', currentUser.id).maybeSingle();
        setAlready(data || null);
      }
      setLoading(false);
    })();
  }, [tryout.id]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !tryout.id) return;
    setSending(true); setError(''); setMessage('');
    const sb = createClient();
    const { data, error: insertError } = await sb.from('tutorin_tryout_registrations')
      .insert({ tryout_id: tryout.id, user_id: user.id, full_name: name.trim(), email: user.email || '', phone: phone.trim(), school: school.trim(), status: 'pending', payment_status: 'pending' })
      .select('id,status,unique_code,created_at,payment_status,admin_note').single();
    if (insertError) {
      if (insertError.code === '23505') setError('Akun ini sudah terdaftar untuk paket tersebut. Periksa status pendaftaran di bawah.');
      else setError(insertError.message);
    } else {
      setAlready(data);
      setMessage('Pendaftaran tercatat. Silakan transfer sesuai petunjuk, lalu konfirmasi melalui WhatsApp admin.');
    }
    setSending(false);
  }

  if (loading) return <div className="card">Memeriksa akun…</div>;
  if (!configured) return <div className="card registration-panel"><h2>Pendaftaran online belum aktif</h2><p>Integrasi akun dan pendaftaran memerlukan konfigurasi Supabase. Silakan hubungi Tutorin untuk informasi paket.</p></div>;
  if (!user) return <div className="card registration-panel"><h2>Daftar Tryout</h2><p>Masuk atau buat akun Tutorin agar pendaftaran dan kode akses terhubung dengan akun peserta.</p><div className="hero-actions"><Link className="button button-primary" href={`/register?next=${encodeURIComponent(`/tryout/${tryout.slug}`)}`}>Buat akun dan daftar</Link><Link className="button button-light" href={`/login?next=${encodeURIComponent(`/tryout/${tryout.slug}`)}`}>Sudah punya akun? Masuk</Link></div></div>;
  if (!tryout.id) return <div className="card registration-panel"><h2>Pendaftaran belum tersedia</h2><p>Admin perlu mengaktifkan data paket di CMS sebelum pendaftaran diproses.</p></div>;
  if (tryout.registration_open === false && !already) return <div className="card registration-panel"><span className="badge">Pendaftaran ditutup</span><h2>Pendaftaran belum dibuka</h2><p>Admin Tutorin akan membuka pendaftaran setelah harga dan informasi pembayaran dipastikan.</p></div>;

  if (already) {
    const waUrl = getWhatsAppUrl(tryout, already, name || user.user_metadata?.full_name || 'Peserta', phone || user.user_metadata?.phone || '');
    const approved = already.status === 'approved' && Boolean(already.unique_code);
    return <div className="card registration-panel">
      <span className="badge">{approved ? 'Peserta disetujui' : already.status === 'rejected' ? 'Pendaftaran ditolak' : 'Pendaftaran tercatat'}</span>
      <h2>Status pendaftaran Anda</h2>
      {message && <div className="notice">{message}</div>}{error && <div className="notice error-notice">{error}</div>}
      <p>Status pendaftaran: <strong>{approved ? 'Disetujui' : already.status === 'rejected' ? 'Ditolak' : 'Menunggu konfirmasi admin'}</strong></p>
      {approved ? <div className="participant-code"><small>KODE AKSES TRYOUT</small><strong>{already.unique_code}</strong><p>Gunakan kode ini bersama akun yang sama untuk masuk ke ruang ujian.</p><Link className="button button-primary" href={`/tryout/${tryout.slug}/exam`}>Masukkan kode & mulai TO →</Link></div> : <>
        <div className="notice"><strong>Biaya:</strong> {formatRupiah(Number(tryout.price || 0))}<br /><strong>Petunjuk pembayaran:</strong><br />{tryout.payment_instructions || 'Transfer sesuai nominal ke rekening resmi Tutorin. Nama bank, nomor rekening, dan nama penerima harus dicantumkan admin pada informasi paket.'}<br /><br /><strong>Status pembayaran:</strong> {already.payment_status === 'verified' ? 'Terverifikasi' : already.payment_status === 'rejected' ? 'Belum cocok — hubungi admin' : 'Menunggu konfirmasi admin'}</div>
        {already.status !== 'rejected' && waUrl ? <a className="button button-primary" href={waUrl} target="_blank" rel="noopener noreferrer">Konfirmasi pembayaran via WhatsApp</a> : null}
        {!waUrl && already.status !== 'rejected' && <p className="notice">Nomor WhatsApp admin belum dikonfigurasi. Silakan hubungi admin Tutorin.</p>}
        {already.admin_note && <p><small>Catatan admin: {already.admin_note}</small></p>}
        <p><small>Menekan tombol WhatsApp tidak otomatis mengonfirmasi pembayaran. Admin akan mencocokkan transaksi dengan mutasi rekening dan memperbarui status di CMS. Kode akses terbit setelah disetujui.</small></p>
      </>}
    </div>;
  }

  return <form className="card registration-panel" onSubmit={submit}>
    <h2>Daftar Tryout</h2><p>Isi data peserta. Setelah pendaftaran tercatat, website menampilkan instruksi transfer dan tombol konfirmasi melalui WhatsApp. Tidak perlu mengunggah bukti pembayaran.</p>
    {error && <div className="notice error-notice">{error}</div>}{message && <div className="notice">{message}</div>}
    <label className="label">Nama lengkap murid<input className="input" value={name} required onChange={e => setName(e.target.value)} /></label>
    <label className="label">Nomor WhatsApp orangtua/murid<input className="input" value={phone} required inputMode="tel" onChange={e => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" /></label>
    <label className="label">Asal sekolah<input className="input" value={school} required onChange={e => setSchool(e.target.value)} placeholder="Nama sekolah" /></label>
    <button className="button button-primary" disabled={sending}>{sending ? 'Mengirim pendaftaran…' : 'Daftar & lihat instruksi pembayaran'}</button>
    <small>Biaya: {formatRupiah(Number(tryout.price || 0))}. Pendaftaran belum dianggap lunas sampai admin memeriksa mutasi rekening dan menyetujui pendaftaran.</small>
  </form>;
}
