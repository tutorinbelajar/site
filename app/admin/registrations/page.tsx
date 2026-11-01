'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

type Registration = {
  id: string; tryout_id: string; full_name: string; email: string; phone: string; school: string;
  status: string; payment_status: string | null; unique_code: string | null; created_at: string; admin_note: string | null;
  tryout?: { title: string; price: number | null } | null;
};

const rupiah = (value: number | null | undefined) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

export default function TryoutRegistrationsPage() {
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');
  const [busy, setBusy] = useState('');

  async function load() {
    setLoading(true); setError('');
    const sb = createClient();
    const { data, error: queryError } = await sb.from('tutorin_tryout_registrations')
      .select('id,tryout_id,full_name,email,phone,school,status,payment_status,unique_code,created_at,admin_note,tutorin_tryouts(title,price)')
      .order('created_at', { ascending: false });
    if (queryError) { setError(queryError.message); setLoading(false); return; }
    const normalized = (data || []).map((r: any) => ({ ...r, tryout: Array.isArray(r.tutorin_tryouts) ? r.tutorin_tryouts[0] : r.tutorin_tryouts })) as Registration[];
    setRows(normalized); setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function approve(row: Registration) {
    const isPaid = Number(row.tryout?.price || 0) > 0;
    const confirmation = isPaid
      ? `Pastikan Anda sudah melihat mutasi rekening dan menemukan transaksi ${rupiah(row.tryout?.price)} dari ${row.full_name}. Setelah disetujui, kode akses akan diterbitkan. Lanjutkan?`
      : `Setujui peserta ${row.full_name} untuk tryout gratis dan terbitkan kode akses?`;
    if (!window.confirm(confirmation)) return;
    setBusy(row.id); setError('');
    const sb = createClient();
    const { error: updateError } = await sb.from('tutorin_tryout_registrations').update({
      status: 'approved',
      payment_status: isPaid ? 'verified' : 'not_required',
      admin_note: isPaid ? 'Pembayaran dicocokkan dengan mutasi rekening oleh admin Tutorin.' : 'Pendaftaran gratis disetujui admin Tutorin.'
    }).eq('id', row.id);
    if (updateError) setError(updateError.message);
    else await load();
    setBusy('');
  }

  async function reject(row: Registration) {
    const note = window.prompt('Alasan penolakan atau instruksi untuk peserta:', 'Pembayaran belum ditemukan pada mutasi rekening. Silakan hubungi admin Tutorin.') ;
    if (note === null) return;
    setBusy(row.id); setError('');
    const sb = createClient();
    const { error: updateError } = await sb.from('tutorin_tryout_registrations').update({ status: 'rejected', payment_status: 'rejected', admin_note: note.trim() || 'Pendaftaran ditolak admin Tutorin.' }).eq('id', row.id);
    if (updateError) setError(updateError.message);
    else await load();
    setBusy('');
  }

  const shown = rows.filter(r => filter === 'all' || r.status === filter);
  return <>
    <div className="section-title"><div className="eyebrow">CMS / Pendaftaran Tryout</div><h1>Pendaftar Tryout</h1><p>Konfirmasi pembayaran tanpa upload bukti. Hubungi peserta bila perlu, cocokkan nominal dan waktu transaksi dengan mutasi rekening, lalu setujui untuk menerbitkan kode akses.</p></div>
    {error && <div className="notice error-notice">{error}</div>}
    <div className="cms-toolbar"><select className="input" value={filter} onChange={e => setFilter(e.target.value)}><option value="pending">Menunggu konfirmasi</option><option value="approved">Disetujui</option><option value="rejected">Ditolak</option><option value="all">Semua status</option></select><button className="button button-light" onClick={() => void load()}>Muat ulang</button></div>
    <div className="table-wrap"><table className="table"><thead><tr><th>Peserta</th><th>Tryout / Biaya</th><th>Kontak & sekolah</th><th>Tanggal daftar</th><th>Pembayaran</th><th>Status / Kode</th><th>Aksi</th></tr></thead><tbody>
      {loading ? <tr><td colSpan={7}>Memuat pendaftar…</td></tr> : shown.map(row => {
        const paid = Number(row.tryout?.price || 0) > 0;
        const phoneDigits = (row.phone || '').replace(/\D/g, '').replace(/^0/, '62');
        const waLink = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Halo ${row.full_name}, admin Tutorin ingin mengonfirmasi pembayaran pendaftaran ${row.tryout?.title || 'tryout'}. Mohon informasikan tanggal/waktu transfer dan nama pengirim rekening. Tidak perlu mengirim bukti ke website.`)}` : null;
        return <tr key={row.id}>
          <td><strong>{row.full_name}</strong><br /><small>{row.email}</small><br /><small>ID: <code>{row.id.slice(0, 8).toUpperCase()}</code></small></td>
          <td>{row.tryout?.title || row.tryout_id}<br /><small>{rupiah(row.tryout?.price)}</small></td>
          <td>{row.phone}<br /><small>{row.school}</small>{waLink && <div><a href={waLink} target="_blank" rel="noreferrer">Hubungi via WhatsApp ↗</a></div>}</td>
          <td>{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
          <td><span className="badge">{row.payment_status === 'verified' ? 'Terverifikasi' : row.payment_status === 'not_required' ? 'Gratis' : row.payment_status === 'rejected' ? 'Belum cocok/ditolak' : paid ? 'Menunggu pengecekan mutasi' : 'Belum diatur'}</span><br /><small>{paid ? 'Cek mutasi rekening secara manual' : 'Tidak ada pembayaran'}</small></td>
          <td><span className="badge">{row.status}</span>{row.unique_code && <div><code>{row.unique_code}</code></div>}{row.admin_note && <small>{row.admin_note}</small>}</td>
          <td><div className="row-actions">{row.status !== 'approved' && <button className="button button-primary" disabled={busy === row.id} onClick={() => void approve(row)}>{busy === row.id ? 'Memproses…' : paid ? 'Verifikasi & setujui' : 'Setujui & buat kode'}</button>}{row.status !== 'rejected' && <button className="button button-light" disabled={busy === row.id} onClick={() => void reject(row)}>Tolak</button>}</div></td>
        </tr>;
      })}
      {!loading && shown.length === 0 && <tr><td colSpan={7}>Belum ada pendaftar untuk filter ini.</td></tr>}
    </tbody></table></div>
  </>;
}
