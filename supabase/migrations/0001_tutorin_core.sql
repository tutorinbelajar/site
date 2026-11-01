-- Tutorin core schema
-- Apply in Supabase SQL Editor / migrations.

create extension if not exists "pgcrypto";

create type public.program_category as enum ('privat', 'kelas');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.user_role as enum ('student', 'parent', 'tutor', 'content_admin', 'question_admin', 'program_admin', 'finance_admin', 'super_admin');
create type public.test_type as enum ('tryout', 'practice', 'quiz');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category public.program_category not null,
  name text not null,
  short_description text,
  description text,
  level text,
  subject text,
  image_url text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.program_packages (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  name text not null,
  meetings integer,
  price bigint,
  currency text not null default 'IDR',
  sort_order integer not null default 0,
  status public.content_status not null default 'published'
);

create table public.program_features (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  feature text not null,
  sort_order integer not null default 0
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  category text,
  cover_url text,
  seo_title text,
  seo_description text,
  author_id uuid references public.profiles(id),
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ebooks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category text,
  cover_url text,
  file_url text,
  price bigint default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.question_banks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  program_category public.program_category,
  subject text,
  level text,
  description text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  bank_id uuid references public.question_banks(id) on delete set null,
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
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_key text not null,
  option_text text not null,
  sort_order integer not null default 0,
  unique(question_id, option_key)
);

create table public.tests (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  test_type public.test_type not null default 'tryout',
  program_category public.program_category,
  level text,
  subject text,
  duration_minutes integer,
  instructions text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete restrict,
  sort_order integer not null,
  points numeric not null default 1,
  unique(test_id, question_id),
  unique(test_id, sort_order)
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric,
  correct_count integer,
  total_questions integer,
  status text not null default 'in_progress'
);

create table public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete restrict,
  selected_answer text,
  is_correct boolean,
  points numeric,
  answered_at timestamptz not null default now(),
  unique(attempt_id, question_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  product_type text not null,
  product_id uuid,
  amount bigint not null default 0,
  currency text not null default 'IDR',
  status text not null default 'pending',
  external_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_programs_category on public.programs(category, status, sort_order);
create index idx_articles_status on public.articles(status, published_at desc);
create index idx_questions_bank on public.questions(bank_id);
create index idx_tests_status on public.tests(status, published_at desc);
create index idx_attempts_user on public.attempts(user_id, started_at desc);

alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.program_packages enable row level security;
alter table public.program_features enable row level security;
alter table public.articles enable row level security;
alter table public.ebooks enable row level security;
alter table public.question_banks enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.orders enable row level security;

-- Public catalog read policies.
create policy "published programs are public" on public.programs for select using (status = 'published');
create policy "published program packages are public" on public.program_packages for select using (status = 'published');
create policy "program features are public" on public.program_features for select using (true);
create policy "published articles are public" on public.articles for select using (status = 'published');
create policy "published ebooks are public" on public.ebooks for select using (status = 'published');
create policy "published tests are public" on public.tests for select using (status = 'published');
create policy "published test questions are public" on public.test_questions for select using (exists (select 1 from public.tests t where t.id = test_id and t.status = 'published'));
create policy "published questions are public" on public.questions for select using (status = 'published');
create policy "options for published questions are public" on public.question_options for select using (exists (select 1 from public.questions q where q.id = question_id and q.status = 'published'));

-- User-owned learning data.
create policy "users read own attempts" on public.attempts for select using (auth.uid() = user_id);
create policy "users create own attempts" on public.attempts for insert with check (auth.uid() = user_id);
create policy "users update own attempts" on public.attempts for update using (auth.uid() = user_id);
create policy "users read own answers" on public.attempt_answers for select using (exists (select 1 from public.attempts a where a.id = attempt_id and a.user_id = auth.uid()));
create policy "users create own answers" on public.attempt_answers for insert with check (exists (select 1 from public.attempts a where a.id = attempt_id and a.user_id = auth.uid()));

-- Profile self-read/update.
create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);

-- NOTE: Admin CRUD policies should be added after implementing a secure role-check helper.
-- Do not use a client-side role flag as an authorization mechanism.
