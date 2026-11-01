-- Tutorin Tryout registration, price and CMS approval workflow.
alter table public.tutorin_tryouts
  add column if not exists price bigint,
  add column if not exists registration_open boolean not null default true;

create table if not exists public.tutorin_tryout_registrations (
  id uuid primary key default gen_random_uuid(),
  tryout_id uuid not null references public.tutorin_tryouts(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  school text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  unique_code text unique,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tryout_id,user_id)
);

create index if not exists idx_tutorin_tryout_registrations_status
  on public.tutorin_tryout_registrations(status, created_at desc);
create index if not exists idx_tutorin_tryout_registrations_user
  on public.tutorin_tryout_registrations(user_id, created_at desc);

alter table public.tutorin_tryout_registrations enable row level security;
grant select, insert, update, delete on public.tutorin_tryout_registrations to authenticated;

create policy "participant reads own tryout registrations"
  on public.tutorin_tryout_registrations for select to authenticated
  using (user_id = auth.uid() or private.tutorin_is_admin());

create policy "participant submits own pending registration"
  on public.tutorin_tryout_registrations for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
    and unique_code is null
    and private.tutorin_is_admin() = false
  );

create policy "admins manage tryout registrations"
  on public.tutorin_tryout_registrations for update to authenticated
  using (private.tutorin_is_admin())
  with check (private.tutorin_is_admin());

create policy "admins delete tryout registrations"
  on public.tutorin_tryout_registrations for delete to authenticated
  using (private.tutorin_is_admin());

create or replace function public.tutorin_assign_tryout_code()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' and (old.status is distinct from new.status or new.unique_code is null) then
    if new.unique_code is null then
      new.unique_code := 'TKA26-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    end if;
  elsif new.status <> 'approved' then
    new.unique_code := null;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_tutorin_assign_tryout_code on public.tutorin_tryout_registrations;
create trigger trg_tutorin_assign_tryout_code
before update of status on public.tutorin_tryout_registrations
for each row execute function public.tutorin_assign_tryout_code();

-- Seed the supplied sample exam. Price intentionally remains NULL until Tutorin confirms it.
insert into public.tutorin_tryouts
  (slug,title,category,level,subject,duration_minutes,question_count,price,registration_open,instructions,status,published_at)
values
  ('tka-sd-matematika-paket-2',
   'Tryout TKA SD Matematika — Paket 2',
   'TKA SD Matematika','SD','Matematika',75,30,null,false,
   'Paket latihan TKA SD Matematika Paket 2. Peserta diminta menyelesaikan 30 soal dalam 75 menit. Ikuti instruksi pada halaman ujian dan gunakan kode peserta setelah pendaftaran disetujui admin.',
   'published',now())
on conflict (slug) do update set
  title=excluded.title,
  category=excluded.category,
  level=excluded.level,
  subject=excluded.subject,
  duration_minutes=excluded.duration_minutes,
  question_count=excluded.question_count,
  instructions=excluded.instructions,
  status='published';
