-- Tutorin: manual payment verification and private exam-code access.
-- Run after migrations 0001-0005 in Supabase SQL Editor.

alter table public.tutorin_tryouts
  add column if not exists payment_instructions text;

create table if not exists public.tutorin_tryout_payment_submissions (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.tutorin_tryout_registrations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  proof_url text not null,
  amount bigint not null check (amount >= 0),
  status text not null default 'submitted' check (status in ('submitted','verified','rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tutorin_payment_reg_created
  on public.tutorin_tryout_payment_submissions(registration_id, created_at desc);
create index if not exists idx_tutorin_payment_status_created
  on public.tutorin_tryout_payment_submissions(status, created_at desc);

alter table public.tutorin_tryout_payment_submissions enable row level security;
grant select, insert on public.tutorin_tryout_payment_submissions to authenticated;
grant update on public.tutorin_tryout_payment_submissions to authenticated;

drop policy if exists "participants read own payment proofs" on public.tutorin_tryout_payment_submissions;
create policy "participants read own payment proofs"
  on public.tutorin_tryout_payment_submissions for select to authenticated
  using (user_id = auth.uid() or private.tutorin_is_admin());

drop policy if exists "participants submit own payment proof" on public.tutorin_tryout_payment_submissions;
create policy "participants submit own payment proof"
  on public.tutorin_tryout_payment_submissions for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'submitted'
    and exists (
      select 1 from public.tutorin_tryout_registrations r
      where r.id = registration_id
        and r.user_id = auth.uid()
        and r.status = 'pending'
    )
  );

drop policy if exists "admins verify payment proofs" on public.tutorin_tryout_payment_submissions;
create policy "admins verify payment proofs"
  on public.tutorin_tryout_payment_submissions for update to authenticated
  using (private.tutorin_is_admin())
  with check (private.tutorin_is_admin());

-- Set payment amount from the CMS price and enforce proof ownership/path server-side.
create or replace function public.tutorin_guard_payment_submission()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  reg_user uuid; reg_status text; actual_price bigint;
begin
  select r.user_id, r.status, t.price into reg_user, reg_status, actual_price
  from public.tutorin_tryout_registrations r
  join public.tutorin_tryouts t on t.id = r.tryout_id
  where r.id = new.registration_id;
  if reg_user is null or reg_user <> auth.uid() or new.user_id <> auth.uid() or reg_status <> 'pending' then
    raise exception 'Pendaftaran tidak valid untuk bukti pembayaran ini';
  end if;
  if new.proof_url not like auth.uid()::text || '/' || new.registration_id::text || '/%' then
    raise exception 'Lokasi bukti pembayaran tidak sesuai akun';
  end if;
  new.amount := coalesce(actual_price, 0);
  new.status := 'submitted';
  new.admin_note := null;
  return new;
end; $$;
drop trigger if exists trg_tutorin_guard_payment_submission on public.tutorin_tryout_payment_submissions;
create trigger trg_tutorin_guard_payment_submission
before insert on public.tutorin_tryout_payment_submissions
for each row execute function public.tutorin_guard_payment_submission();

-- Payment proof images are private. The database stores the storage object path,
-- not a public URL. Admins create short-lived signed URLs when reviewing a proof.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tutorin-payment-proofs','tutorin-payment-proofs',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false, file_size_limit=5242880, allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "participants upload own proof files" on storage.objects;
create policy "participants upload own proof files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'tutorin-payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "participants and admins read proof files" on storage.objects;
create policy "participants and admins read proof files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'tutorin-payment-proofs'
    and ((storage.foldername(name))[1] = auth.uid()::text or private.tutorin_is_admin())
  );

-- Keep sample tryout published but closed until price and transfer details are set in CMS.
update public.tutorin_tryouts
set registration_open=false,
    payment_instructions=coalesce(payment_instructions,
      'Admin Tutorin akan mengirimkan detail rekening/metode pembayaran resmi setelah pendaftaran tercatat. Transfer sesuai nominal yang tertera dan unggah bukti pembayaran pada akun Tutorin Anda.')
where slug='tka-sd-matematika-paket-2';

-- Enforce payment verification at database level, not only in the CMS button state.
create or replace function public.tutorin_require_verified_payment()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  actual_price bigint;
begin
  if new.status = 'approved' and old.status is distinct from new.status then
    select t.price into actual_price
    from public.tutorin_tryouts t where t.id = new.tryout_id;
    if coalesce(actual_price,0) > 0 and not exists (
      select 1 from public.tutorin_tryout_payment_submissions p
      where p.registration_id = new.id and p.status = 'verified'
    ) then
      raise exception 'Pembayaran harus diverifikasi sebelum pendaftaran disetujui';
    end if;
  end if;
  return new;
end; $$;
drop trigger if exists trg_tutorin_require_verified_payment on public.tutorin_tryout_registrations;
create trigger trg_tutorin_require_verified_payment
before update of status on public.tutorin_tryout_registrations
for each row execute function public.tutorin_require_verified_payment();

-- Use a year-aware general TO code prefix instead of a fixed TKA26 prefix.
create or replace function public.tutorin_assign_tryout_code()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'approved' and (old.status is distinct from new.status or new.unique_code is null) then
    if new.unique_code is null then
      new.unique_code := 'TO-' || to_char(now(), 'YY') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    end if;
  elsif new.status <> 'approved' then
    new.unique_code := null;
  end if;
  new.updated_at := now();
  return new;
end; $$;
