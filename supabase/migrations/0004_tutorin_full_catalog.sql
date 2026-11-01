-- Baseline CMS catalog for Tutorin. Existing rows are not overwritten.
insert into public.tutorin_programs (slug,category,name,short_description,level,subject,status,sort_order)
values
('reguler-sd-1-3-nasional','privat','Reguler SD 1–3 Nasional','Pendampingan privat Reguler SD 1–3 Nasional dengan materi dan target belajar yang disesuaikan.','SD 1–3','Nasional','published',1),
('reguler-sd-4-6-nasional','privat','Reguler SD 4–6 Nasional','Pendampingan privat Reguler SD 4–6 Nasional dengan materi dan target belajar yang disesuaikan.','SD 4–6','Nasional','published',2),
('reguler-smp-7-9-nasional','privat','Reguler SMP 7–9 Nasional','Pendampingan privat Reguler SMP 7–9 Nasional dengan materi dan target belajar yang disesuaikan.','SMP 7–9','Nasional','published',3),
('reguler-sma-10-12-nasional','privat','Reguler SMA 10–12 Nasional','Pendampingan privat Reguler SMA 10–12 Nasional dengan materi dan target belajar yang disesuaikan.','SMA 10–12','Nasional','published',4),
('reguler-sd-1-3-internasional','privat','Reguler SD 1–3 Internasional','Pendampingan privat Reguler SD 1–3 Internasional dengan materi dan target belajar yang disesuaikan.','SD 1–3','Internasional','published',5),
('reguler-sd-4-6-internasional','privat','Reguler SD 4–6 Internasional','Pendampingan privat Reguler SD 4–6 Internasional dengan materi dan target belajar yang disesuaikan.','SD 4–6','Internasional','published',6),
('reguler-smp-7-9-internasional','privat','Reguler SMP 7–9 Internasional','Pendampingan privat Reguler SMP 7–9 Internasional dengan materi dan target belajar yang disesuaikan.','SMP 7–9','Internasional','published',7),
('reguler-sma-10-12-internasional','privat','Reguler SMA 10–12 Internasional','Pendampingan privat Reguler SMA 10–12 Internasional dengan materi dan target belajar yang disesuaikan.','SMA 10–12','Internasional','published',8),
('tka-sd','privat','TKA SD','Pendampingan privat TKA SD dengan materi dan target belajar yang disesuaikan.','SD','TKA','published',9),
('tka-smp','privat','TKA SMP','Pendampingan privat TKA SMP dengan materi dan target belajar yang disesuaikan.','SMP','TKA','published',10),
('tka-sma','privat','TKA SMA','Pendampingan privat TKA SMA dengan materi dan target belajar yang disesuaikan.','SMA','TKA','published',11),
('snbt-mandiri-iup','privat','SNBT / Mandiri / IUP','Pendampingan privat SNBT / Mandiri / IUP dengan materi dan target belajar yang disesuaikan.','SMA / Mahasiswa','Seleksi masuk kampus','published',12),
('olimpiade-sd','privat','Olimpiade SD','Pendampingan privat Olimpiade SD dengan materi dan target belajar yang disesuaikan.','SD','Olimpiade','published',13),
('olimpiade-smp','privat','Olimpiade SMP','Pendampingan privat Olimpiade SMP dengan materi dan target belajar yang disesuaikan.','SMP','Olimpiade','published',14),
('olimpiade-sma','privat','Olimpiade SMA','Pendampingan privat Olimpiade SMA dengan materi dan target belajar yang disesuaikan.','SMA','Olimpiade','published',15),
('kuliah-semester-1-2','privat','Kuliah Semester 1–2','Pendampingan privat Kuliah Semester 1–2 dengan materi dan target belajar yang disesuaikan.','Mahasiswa','Akademik kampus','published',16),
('kuliah-semester-3-akhir','privat','Kuliah Semester 3–akhir','Pendampingan privat Kuliah Semester 3–akhir dengan materi dan target belajar yang disesuaikan.','Mahasiswa','Akademik kampus','published',17),
('kelas-tka-matematika-sd','kelas','Kelas Intensif TKA Matematika SD','Kelas intensif persiapan TKA Matematika untuk siswa kelas 6.','SD · Kelas 6','TKA Matematika','published',1),
('kelas-tka-matematika-smp','kelas','Kelas Intensif TKA Matematika SMP','Kelas intensif persiapan TKA Matematika untuk siswa kelas 9.','SMP · Kelas 9','TKA Matematika','published',2)
on conflict (slug) do nothing;

-- Published package ladder for all seeded private offers.
with catalog(slug,boost,growth,mastery) as (values
('reguler-sd-1-3-nasional',720000,1280000,2400000),
('reguler-sd-4-6-nasional',800000,1440000,2720000),
('reguler-smp-7-9-nasional',960000,1760000,3360000),
('reguler-sma-10-12-nasional',1120000,2080000,4000000),
('reguler-sd-1-3-internasional',1120000,2080000,4000000),
('reguler-sd-4-6-internasional',1280000,2400000,4640000),
('reguler-smp-7-9-internasional',1440000,2720000,5280000),
('reguler-sma-10-12-internasional',1600000,3040000,5920000),
('tka-sd',880000,1600000,3040000),
('tka-smp',1040000,1920000,3680000),
('tka-sma',1200000,2240000,4320000),
('snbt-mandiri-iup',1280000,2400000,4640000),
('olimpiade-sd',1280000,2400000,4640000),
('olimpiade-smp',1440000,2720000,5280000),
('olimpiade-sma',1600000,3040000,5920000),
('kuliah-semester-1-2',1440000,2720000,5280000),
('kuliah-semester-3-akhir',1600000,3040000,5920000)
)
insert into public.tutorin_program_packages (program_id,name,meetings,price,currency,sort_order,status)
select p.id, pkg.name, pkg.meetings, pkg.price, 'IDR', pkg.sort_order, 'published'
from catalog c
join public.tutorin_programs p on p.slug=c.slug
cross join lateral (values
  ('Boost',8,c.boost,1),
  ('Growth',16,c.growth,2),
  ('Mastery',32,c.mastery,3)
) as pkg(name,meetings,price,sort_order)
where not exists (select 1 from public.tutorin_program_packages existing where existing.program_id=p.id);

insert into public.tutorin_program_features (program_id,feature,sort_order)
select p.id, f.feature, f.sort_order
from public.tutorin_programs p
cross join (values
  ('Jadwal fleksibel menyesuaikan waktu murid',1),
  ('Materi sesuai kebutuhan dan kesulitan belajar',2),
  ('Dibimbing sampai benar-benar memahami materi',3),
  ('Pilihan tutor dari kampus TOP dan kampus favorit lainnya',4),
  ('Report belajar setiap pertemuan dan analisa belajar bulanan',5)
) f(feature,sort_order)
where p.category='privat'
and not exists (select 1 from public.tutorin_program_features old where old.program_id=p.id);

-- Current class price stages from the program poster; names include the booking window.
insert into public.tutorin_program_packages (program_id,name,meetings,price,currency,sort_order,status)
select p.id, x.name, 8, x.price, 'IDR', x.sort_order, 'published'
from public.tutorin_programs p
join (values
 ('kelas-tka-matematika-sd','Super Early Bird · s.d. 30 Sep 2026',79000,1),
 ('kelas-tka-matematika-sd','Early Bird · 1 Okt–30 Nov 2026',119000,2),
 ('kelas-tka-matematika-sd','Normal · 1 Des 2026–6 Feb 2027',149000,3),
 ('kelas-tka-matematika-smp','Super Early Bird · s.d. 30 Sep 2026',99000,1),
 ('kelas-tka-matematika-smp','Early Bird · 1 Okt–30 Nov 2026',139000,2),
 ('kelas-tka-matematika-smp','Normal · 1 Des 2026–29 Jan 2027',169000,3)
) x(slug,name,price,sort_order) on x.slug=p.slug
where not exists (select 1 from public.tutorin_program_packages pkg where pkg.program_id=p.id);
