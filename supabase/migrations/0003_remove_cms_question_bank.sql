-- Bank soal bukan lagi modul CMS pusat.
-- Setiap TO menyimpan soal dan source code di folder GitHub masing-masing.
drop table if exists public.tutorin_tryout_questions cascade;
drop table if exists public.tutorin_question_options cascade;
drop table if exists public.tutorin_questions cascade;
