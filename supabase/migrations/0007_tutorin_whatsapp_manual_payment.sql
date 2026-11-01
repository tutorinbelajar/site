-- Tutorin manual transfer confirmation via WhatsApp.
-- No receipt upload or payment-proof file is required.
-- Run after migrations 0001-0006.

alter table public.tutorin_tryout_registrations
  add column if not exists payment_status text not null default 'pending',
  add column if not exists payment_reference text,
  add column if not exists transfer_at timestamptz,
  add column if not exists verified_by uuid references auth.users(id) on delete set null,
  add column if not exists verified_at timestamptz;

update public.tutorin_tryout_registrations
set payment_status = case
  when status = 'approved' then 'verified'
  when status = 'rejected' then 'rejected'
  else 'pending'
end
where payment_status is null or payment_status = '';

alter table public.tutorin_tryout_registrations
  alter column payment_status set default 'pending';

do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tutorin_tryout_registrations_payment_status_check'
      and conrelid = 'public.tutorin_tryout_registrations'::regclass
  ) then
    alter table public.tutorin_tryout_registrations
      add constraint tutorin_tryout_registrations_payment_status_check
      check (payment_status in ('pending','verified','not_required','rejected'));
  end if;
end $$;

create index if not exists idx_tutorin_tryout_registrations_payment_status
  on public.tutorin_tryout_registrations(payment_status, created_at desc);

-- Disable all proof upload/read policies and remove the proof metadata table.
-- The private Storage bucket is deliberately left in place to avoid destructive
-- removal of any legacy objects; it has no participant upload policy after this migration.
drop policy if exists "participants upload own proof files" on storage.objects;
drop policy if exists "participants and admins read proof files" on storage.objects;
drop policy if exists "participants read own payment proofs" on public.tutorin_tryout_payment_submissions;
drop policy if exists "participants submit own payment proof" on public.tutorin_tryout_payment_submissions;
drop policy if exists "admins verify payment proofs" on public.tutorin_tryout_payment_submissions;
drop table if exists public.tutorin_tryout_payment_submissions cascade;

-- Enforce that paid registrations cannot be approved unless admin records
-- payment verification. Free registrations use payment_status = not_required.
create or replace function public.tutorin_require_verified_payment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actual_price bigint;
begin
  if new.status = 'approved' and old.status is distinct from new.status then
    select t.price into actual_price
    from public.tutorin_tryouts t
    where t.id = new.tryout_id;

    if coalesce(actual_price, 0) > 0 and new.payment_status <> 'verified' then
      raise exception 'Pembayaran harus dicocokkan dengan mutasi rekening sebelum pendaftaran disetujui';
    end if;

    if coalesce(actual_price, 0) <= 0 then
      new.payment_status := 'not_required';
    end if;

    new.verified_at := case when new.payment_status = 'verified' then coalesce(new.verified_at, now()) else null end;
    new.verified_by := case when new.payment_status = 'verified' then coalesce(new.verified_by, auth.uid()) else null end;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_tutorin_require_verified_payment on public.tutorin_tryout_registrations;
create trigger trg_tutorin_require_verified_payment
before update of status on public.tutorin_tryout_registrations
for each row execute function public.tutorin_require_verified_payment();

-- Refresh CMS instructions on the sample TO; final account details are entered by admin.
update public.tutorin_tryouts
set payment_instructions = coalesce(payment_instructions,
  'Transfer ke rekening resmi Tutorin sesuai nominal. Setelah transfer, tekan Konfirmasi via WhatsApp dan tuliskan waktu transfer serta nama pengirim. Tidak perlu mengunggah bukti. Admin mencocokkan transaksi dengan mutasi rekening sebelum menerbitkan kode akses.')
where slug = 'tka-sd-matematika-paket-2';
