insert into public.programs (slug, category, name, short_description, level, subject, status, sort_order) values
('privat-tka-sd','privat','Privat TKA SD','Bimbingan 1-on-1 untuk persiapan TKA SD sesuai kebutuhan belajar siswa.','SD','TKA','published',1),
('privat-snbt','privat','Privat SNBT / Mandiri / IUP','Pendampingan personal untuk target SNBT, Mandiri, dan IUP.','SMA / Mahasiswa','SNBT','published',2),
('kelas-tka-matematika-sd','kelas','Kelas TKA Matematika SD','Kelas terstruktur untuk TKA Matematika SD.','SD','TKA Matematika','published',1),
('kelas-tka-matematika-smp','kelas','Kelas TKA Matematika SMP','Kelas terstruktur untuk TKA Matematika SMP.','SMP','TKA Matematika','published',2),
('kelas-snbt-pk','kelas','Kelas SNBT PK','Kelas persiapan Penalaran Kuantitatif SNBT.','SMA','SNBT PK','published',3),
('kelas-snbt-pm','kelas','Kelas SNBT PM','Kelas persiapan Penalaran Matematika SNBT.','SMA','SNBT PM','published',4)
on conflict (slug) do nothing;
