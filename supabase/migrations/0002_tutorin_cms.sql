-- Tutorin CMS: content CRUD, admin authorization, and traffic analytics.
-- Run on the Supabase project used by the Tutorin website.

create schema if not exists private;

create table if not exists public.tutorin_programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null check (category in ('privat','kelas')),
  name text not null,
  short_description text,
  description text,
  level text,
  subject text,
  image_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tutorin_program_packages (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.tutorin_programs(id) on delete cascade,
  name text not null,
  meetings integer,
  price bigint,
  currency text not null default 'IDR',
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft','published','archived'))
);

create table if not exists public.tutorin_program_features (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.tutorin_programs(id) on delete cascade,
  feature text not null,
  sort_order integer not null default 0
);

create table if not exists public.tutorin_tryouts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  level text,
  subject text,
  duration_minutes integer,
  question_count integer not null default 0,
  github_path text,
  deployment_url text,
  instructions text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tutorin_questions (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  question_text text not null,
  question_type text not null default 'multiple_choice',
  level text,
  subject text,
  topic text,
  difficulty text,
  answer_explanation text,
  correct_answer text,
  media_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tutorin_question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.tutorin_questions(id) on delete cascade,
  option_key text not null,
  option_text text not null,
  sort_order integer not null default 0,
  unique(question_id, option_key)
);

create table if not exists public.tutorin_tryout_questions (
  id uuid primary key default gen_random_uuid(),
  tryout_id uuid not null references public.tutorin_tryouts(id) on delete cascade,
  question_id uuid not null references public.tutorin_questions(id) on delete restrict,
  sort_order integer not null,
  points numeric not null default 1,
  unique(tryout_id, question_id),
  unique(tryout_id, sort_order)
);

create table if not exists public.tutorin_ebooks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category text,
  cover_url text,
  file_url text,
  purchase_url text,
  price bigint not null default 0,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tutorin_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  category text,
  cover_url text,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tutorin_traffic_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  path text not null,
  visitor_id text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tutorin_programs_status on public.tutorin_programs(status, sort_order);
create index if not exists idx_tutorin_tryouts_status on public.tutorin_tryouts(status, created_at desc);
create index if not exists idx_tutorin_ebooks_status on public.tutorin_ebooks(status, created_at desc);
create index if not exists idx_tutorin_articles_status on public.tutorin_articles(status, published_at desc);
create index if not exists idx_tutorin_traffic_created on public.tutorin_traffic_events(created_at desc);
create index if not exists idx_tutorin_traffic_event on public.tutorin_traffic_events(event_name, created_at desc);

-- Admin authorization is based on the existing admin_users table.
create or replace function private.tutorin_is_admin()
returns boolean
language sql
security definer
set search_path = public, private
as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = (select auth.uid())
  );
$$;

revoke all on function private.tutorin_is_admin() from public;
grant execute on function private.tutorin_is_admin() to authenticated;

-- RLS for every exposed CMS table.
alter table public.tutorin_programs enable row level security;
alter table public.tutorin_program_packages enable row level security;
alter table public.tutorin_program_features enable row level security;
alter table public.tutorin_tryouts enable row level security;
alter table public.tutorin_questions enable row level security;
alter table public.tutorin_question_options enable row level security;
alter table public.tutorin_tryout_questions enable row level security;
alter table public.tutorin_ebooks enable row level security;
alter table public.tutorin_articles enable row level security;
alter table public.tutorin_traffic_events enable row level security;

-- Public website reads published content.
create policy "public reads published programs" on public.tutorin_programs for select to anon, authenticated using (status = 'published');
create policy "public reads published packages" on public.tutorin_program_packages for select to anon, authenticated using (status = 'published');
create policy "public reads program features" on public.tutorin_program_features for select to anon, authenticated using (exists (select 1 from public.tutorin_programs p where p.id = program_id and p.status = 'published'));
create policy "public reads published tryouts" on public.tutorin_tryouts for select to anon, authenticated using (status = 'published');
create policy "public reads published ebooks" on public.tutorin_ebooks for select to anon, authenticated using (status = 'published');
create policy "public reads published articles" on public.tutorin_articles for select to anon, authenticated using (status = 'published');
create policy "public reads published questions" on public.tutorin_questions for select to anon, authenticated using (status = 'published');
create policy "public reads options for published questions" on public.tutorin_question_options for select to anon, authenticated using (exists (select 1 from public.tutorin_questions q where q.id = question_id and q.status = 'published'));
create policy "public reads tryout question links" on public.tutorin_tryout_questions for select to anon, authenticated using (exists (select 1 from public.tutorin_tryouts t where t.id = tryout_id and t.status = 'published'));

-- Admins can fully CRUD CMS content.
create policy "admins manage programs" on public.tutorin_programs for all to authenticated using (private.tutorin_is_admin()) with check (private.tutorin_is_admin());
create policy "admins manage packages" on public.tutorin_program_packages for all to authenticated using (private.tutorin_is_admin()) with check (private.tutorin_is_admin());
create policy "admins manage features" on public.tutorin_program_features for all to authenticated using (private.tutorin_is_admin()) with check (private.tutorin_is_admin());
create policy "admins manage tryouts" on public.tutorin_tryouts for all to authenticated using (private.tutorin_is_admin()) with check (private.tutorin_is_admin());
create policy "admins manage questions" on public.tutorin_questions for all to authenticated using (private.tutorin_is_admin()) with check (private.tutorin_is_admin());
create policy "admins manage question options" on public.tutorin_question_options for all to authenticated using (private.tutorin_is_admin()) with check (private.tutorin_is_admin());
create policy "admins manage tryout question links" on public.tutorin_tryout_questions for all to authenticated using (private.tutorin_is_admin()) with check (private.tutorin_is_admin());
create policy "admins manage ebooks" on public.tutorin_ebooks for all to authenticated using (private.tutorin_is_admin()) with check (private.tutorin_is_admin());
create policy "admins manage articles" on public.tutorin_articles for all to authenticated using (private.tutorin_is_admin()) with check (private.tutorin_is_admin());

-- Anyone can send an anonymous page-view event; only admins can read analytics.
create policy "public inserts traffic" on public.tutorin_traffic_events for insert to anon, authenticated with check (length(path) <= 500 and length(event_name) <= 100);
create policy "admins read traffic" on public.tutorin_traffic_events for select to authenticated using (private.tutorin_is_admin());

-- Seed the current public catalog only when the tables are empty.
insert into public.tutorin_programs (slug, category, name, short_description, level, subject, status, sort_order)
select * from (values
('privat-tka-sd','privat','Privat TKA SD','Bimbingan 1-on-1 untuk persiapan TKA SD sesuai kebutuhan belajar siswa.','SD','TKA','published',1),
('privat-snbt','privat','Privat SNBT / Mandiri / IUP','Pendampingan personal untuk target SNBT, Mandiri, dan IUP.','SMA / Mahasiswa','SNBT','published',2),
('kelas-tka-matematika-sd','kelas','Kelas TKA Matematika SD','Kelas terstruktur untuk TKA Matematika SD.','SD','TKA Matematika','published',3),
('kelas-tka-matematika-smp','kelas','Kelas TKA Matematika SMP','Kelas terstruktur untuk TKA Matematika SMP.','SMP','TKA Matematika','published',4),
('kelas-snbt-pk','kelas','Kelas SNBT PK','Kelas persiapan Penalaran Kuantitatif SNBT.','SMA','SNBT PK','published',5),
('kelas-snbt-pm','kelas','Kelas SNBT PM','Kelas persiapan Penalaran Matematika SNBT.','SMA','SNBT PM','published',6)
) as v(slug,category,name,short_description,level,subject,status,sort_order)
where not exists (select 1 from public.tutorin_programs);
