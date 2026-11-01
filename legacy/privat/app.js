const WA='6283155365009';

// Bust the stylesheet cache after UI releases so GitHub Pages/mobile browsers get the latest CSS.
(function ensureCurrentStyles(){
  const href='styles.css?v=20260904';
  const existing=[...document.querySelectorAll('link[rel="stylesheet"]')].find(l=>l.href.includes('/styles.css'));
  if(existing && existing.getAttribute('href')!==href) existing.setAttribute('href',href);
  if(!existing){ const link=document.createElement('link'); link.rel='stylesheet'; link.href=href; document.head.appendChild(link); }
})();

const goAssessment=()=>window.location.href='assessment.html';
const goNeed=()=>window.location.href='assessment-need.html';
const goMethod=()=>window.location.href='assessment-method.html';
window.startNeedAssessment=goNeed;
window.startMethodAssessment=goMethod;
window.home=()=>window.location.href='index.html';
window.show=()=>{};

// Keep the main navigation focused: remove any legacy Tutorín AI link and rename Asesmen.
(function cleanMainNav(){
  const apply=()=>{
    document.querySelectorAll('.site-header nav a').forEach(link=>{
      const text=link.textContent.trim().toLowerCase();
      const href=(link.getAttribute('href')||'').toLowerCase();
      if(text.includes('tutorín ai') || text.includes('tutorin ai') || href.includes('tutorin-ai')) link.remove();
      else if(text==='asesmen' || text==='asesmen belajar') link.textContent='Analisa Belajar';
    });
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();

// Mobile-friendly hamburger navigation. Desktop navigation stays unchanged.
(function setupMobileNav(){
  const apply=()=>{
    const header=document.querySelector('.site-header');
    const nav=header?.querySelector('nav');
    const inner=header?.querySelector('.header-inner');
    if(!header || !nav || !inner || inner.querySelector('.mobile-menu-toggle')) return;

    const style=document.createElement('style');
    style.textContent=`
      .mobile-menu-toggle{display:none;border:1px solid var(--line);background:#fff;color:var(--ink);width:44px;height:44px;border-radius:13px;align-items:center;justify-content:center;cursor:pointer;padding:0;position:relative;z-index:61}
      .mobile-menu-toggle span,.mobile-menu-toggle span:before,.mobile-menu-toggle span:after{display:block;width:19px;height:2px;background:currentColor;border-radius:4px;transition:transform .2s,opacity .2s}
      .mobile-menu-toggle span:before,.mobile-menu-toggle span:after{content:'';position:absolute}
      .mobile-menu-toggle span:before{transform:translateY(-6px)}
      .mobile-menu-toggle span:after{transform:translateY(6px)}
      .mobile-menu-toggle[aria-expanded="true"] span{background:transparent}
      .mobile-menu-toggle[aria-expanded="true"] span:before{transform:rotate(45deg)}
      .mobile-menu-toggle[aria-expanded="true"] span:after{transform:rotate(-45deg)}
      @media(max-width:720px){
        .header-inner{min-height:64px;position:relative}
        .mobile-menu-toggle{display:inline-flex;flex:none}
        .site-header nav{display:none;position:absolute;left:0;right:0;top:calc(100% + 8px);padding:10px;background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 18px 40px rgba(0,70,42,.14);flex-direction:column;align-items:stretch;gap:3px;z-index:60}
        .site-header nav.mobile-open{display:flex}
        .site-header nav.mobile-open a,.site-header nav.mobile-open a:not(.nav-cta){display:flex !important;align-items:center;min-height:46px;padding:10px 13px;font-size:14px;border-radius:12px}
        .site-header nav a:hover{background:var(--soft)}
        .site-header nav .nav-cta{justify-content:center;margin-top:4px;padding:12px 16px}
      }
    `;
    document.head.appendChild(style);

    const button=document.createElement('button');
    button.type='button';
    button.className='mobile-menu-toggle';
    button.setAttribute('aria-label','Buka menu navigasi');
    button.setAttribute('aria-expanded','false');
    button.innerHTML='<span></span>';
    inner.appendChild(button);

    const close=()=>{
      nav.classList.remove('mobile-open');
      button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-label','Buka menu navigasi');
    };
    button.addEventListener('click',()=>{
      const open=nav.classList.toggle('mobile-open');
      button.setAttribute('aria-expanded',String(open));
      button.setAttribute('aria-label',open?'Tutup menu navigasi':'Buka menu navigasi');
    });
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
    document.addEventListener('click',event=>{
      if(!header.contains(event.target)) close();
    });
    window.addEventListener('resize',()=>{if(window.innerWidth>720) close();});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();

// Add useful reference links to the homepage feature cards.
(function addFeatureReferenceLinks(){
  const apply=()=>{
    const panels=[...document.querySelectorAll('.features-grid .feature-panel')];
    if(!panels.length) return;

    const tutorPanel=panels.find(panel=>panel.querySelector('h3')?.textContent.trim().toLowerCase()==='tutor dipilih untuk kebutuhan anak');
    if(tutorPanel && !tutorPanel.querySelector('[data-feature-link="tutor-profile"]')){
      const link=document.createElement('a');
      link.className='arrow-link';
      link.dataset.featureLink='tutor-profile';
      link.href='https://docs.google.com/presentation/d/1V1NWDzgHvar4TKYSr8c1tVIL2-_Lk__1YVX3p4EgCzs/edit?usp=sharing';
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.textContent='Lihat profil pengajar Tutorin →';
      tutorPanel.appendChild(link);
    }

    const progressPanel=panels.find(panel=>panel.querySelector('h3')?.textContent.trim().toLowerCase()==='orang tua tetap tahu progres');
    if(progressPanel && !progressPanel.querySelector('[data-feature-link="learning-report"]')){
      const link=document.createElement('a');
      link.className='arrow-link';
      link.dataset.featureLink='learning-report';
      link.href='https://docs.google.com/presentation/d/1bEfFeAz_jaUy7g1zDavu5NYER0H_OgFDcTq7RfHPjNM/edit?usp=sharing';
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.textContent='Lihat contoh laporan belajar murid →';
      progressPanel.appendChild(link);
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();

// Replace the generic package cards with a complete, responsive price catalog.
(function setupPriceCatalog(){
  const prices=[
    ['Reguler SD 1–3 Nasional',720000,1280000,2400000,'SD'],
    ['Reguler SD 4–6 Nasional',800000,1440000,2720000,'SD'],
    ['Reguler SMP 7–9 Nasional',960000,1760000,3360000,'SMP'],
    ['Reguler SMA 10–12 Nasional',1120000,2080000,4000000,'SMA'],
    ['Reguler SD 1–3 Internasional',1120000,2080000,4000000,'SD'],
    ['Reguler SD 4–6 Internasional',1280000,2400000,4640000,'SD'],
    ['Reguler SMP 7–9 Internasional',1440000,2720000,5280000,'SMP'],
    ['Reguler SMA 10–12 Internasional',1600000,3040000,5920000,'SMA'],
    ['TKA SD',880000,1600000,3040000,'TKA'],
    ['TKA SMP',1040000,1920000,3680000,'TKA'],
    ['TKA SMA',1200000,2240000,4320000,'TKA'],
    ['SNBT/Mandiri/IUP',1280000,2400000,4640000,'SNBT'],
    ['Olimpiade SD',1280000,2400000,4640000,'Olimpiade'],
    ['Olimpiade SMP',1440000,2720000,5280000,'Olimpiade'],
    ['Olimpiade SMA',1600000,3040000,5920000,'Olimpiade'],
    ['Kuliah Semester 1–2',1440000,2720000,5280000,'Kuliah'],
    ['Kuliah Semester 3–akhir',1600000,3040000,5920000,'Kuliah']
  ];
  const format=n=>'Rp'+n.toLocaleString('id-ID');
  const apply=()=>{
    const section=document.querySelector('.pricing-section');
    const grid=section?.querySelector('.pricing-grid');
    const heading=section?.querySelector('.section-heading');
    if(!section || !grid || !heading || section.querySelector('.price-catalog')) return;

    const style=document.createElement('style');
    style.textContent=`
      .pricing-section .pricing-grid{display:none}
      .price-catalog{margin-top:28px}
      .price-intro{background:linear-gradient(145deg,var(--green),#00462e);color:#fff;border-radius:24px;padding:25px;display:grid;grid-template-columns:1.1fr .9fr;gap:24px;align-items:center}
      .price-intro h3{font-size:25px;line-height:1.15;margin:0 0 8px}
      .price-intro p{margin:0;color:#c9ded5;font-size:12px;line-height:1.7}
      .price-package-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .price-package{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:14px;text-align:center}
      .price-package strong{display:block;font:800 17px 'Plus Jakarta Sans';color:#fff}
      .price-package span{display:block;font-size:9px;color:#d7e8e1;margin-top:3px}
      .price-package.featured{background:var(--gold);border-color:var(--gold);color:var(--ink)}
      .price-package.featured strong,.price-package.featured span{color:var(--ink)}
      .price-catalog-tools{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:20px 0 14px;flex-wrap:wrap}
      .price-catalog-tools strong{font:800 16px 'Plus Jakarta Sans'}
      .price-filters{display:flex;gap:7px;flex-wrap:wrap}
      .price-filter{border:1px solid var(--line);background:#fff;color:#527064;border-radius:99px;padding:8px 11px;font-size:10px;font-weight:900;cursor:pointer}
      .price-filter.active{background:var(--green);border-color:var(--green);color:#fff}
      .price-table-wrap{background:#fff;border:1px solid var(--line);border-radius:24px;overflow:hidden;box-shadow:0 14px 35px rgba(0,91,56,.06)}
      .price-table{width:100%;border-collapse:collapse;font-size:11px}
      .price-table th{background:#f0f8f4;color:var(--green);font-weight:900;text-align:right;padding:15px 16px;border-bottom:1px solid var(--line);white-space:nowrap}
      .price-table th:first-child{text-align:left}
      .price-table th.growth{background:#fff5c9;color:#7a5a00}
      .price-table td{padding:14px 16px;border-bottom:1px solid #edf3ef;text-align:right;white-space:nowrap}
      .price-table td:first-child{text-align:left;color:var(--ink);font-weight:700;white-space:normal}
      .price-table td.growth{background:#fffaf0;color:#8a4b00;font-weight:900}
      .price-table tr:last-child td{border-bottom:0}
      .price-table tbody tr:hover td{background:#f8fcfa}
      .price-table tbody tr:hover td.growth{background:#fff7df}
      .price-mobile-list{display:none}
      .price-mobile-card{background:#fff;border:1px solid var(--line);border-radius:19px;padding:17px;margin-bottom:10px}
      .price-mobile-card h4{font:800 14px 'Plus Jakarta Sans';margin:0 0 12px}
      .price-mobile-options{display:grid;gap:7px}
      .price-mobile-option{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 11px;background:#f8fbf9;border-radius:11px;font-size:10px}
      .price-mobile-option strong{font-size:11px}
      .price-mobile-option.growth{background:#fff5c9;color:#7a4d00}
      .price-mobile-option span{font-weight:900}
      .price-facilities{margin-top:18px;background:#edf6f1;border:1px solid var(--line);border-radius:24px;padding:24px}
      .price-facilities h3{margin:0 0 14px;font-size:21px}
      .price-facility-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px 20px}
      .price-facility{font-size:11px;color:#426656;line-height:1.5}
      .price-facility::before{content:'✓';display:inline-grid;place-items:center;width:20px;height:20px;margin-right:7px;border-radius:50%;background:#fff;color:var(--green-2);font-weight:900}
      .price-cta{margin-top:16px;display:flex;justify-content:center}
      .price-cta a{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:13px 20px;border-radius:14px;background:var(--gold);color:var(--ink);font-size:12px;font-weight:900;text-decoration:none;box-shadow:0 10px 24px rgba(244,197,27,.24)}
      @media(max-width:720px){
        .price-intro{grid-template-columns:1fr;padding:20px}
        .price-intro h3{font-size:21px}
        .price-package-row{gap:7px}
        .price-package{padding:11px 7px}
        .price-package strong{font-size:14px}
        .price-package span{font-size:8px}
        .price-table-wrap{display:none}
        .price-mobile-list{display:block}
        .price-catalog-tools{align-items:flex-start;flex-direction:column;margin-top:18px}
        .price-filters{width:100%;overflow-x:auto;flex-wrap:nowrap;padding-bottom:3px;scrollbar-width:none}
        .price-filters::-webkit-scrollbar{display:none}
        .price-filter{white-space:nowrap}
        .price-facility-grid{grid-template-columns:1fr}
        .price-facilities{padding:19px}
      }
    `;
    document.head.appendChild(style);

    const catalog=document.createElement('div');
    catalog.className='price-catalog';
    catalog.innerHTML=`
      <div class="price-intro">
        <div><h3>Paket belajar yang fleksibel untuk setiap kebutuhan</h3><p>Harga disesuaikan dengan jenjang, jenis program, dan intensitas pendampingan. Pilih paket yang paling sesuai dengan target belajar.</p></div>
        <div class="price-package-row">
          <div class="price-package"><strong>BOOST</strong><span>8× pertemuan</span></div>
          <div class="price-package featured"><strong>GROWTH</strong><span>16× • Paling dipilih</span></div>
          <div class="price-package"><strong>MASTERY</strong><span>32× pertemuan</span></div>
        </div>
      </div>
      <div class="price-catalog-tools"><strong>Katalog harga Tutorin Privat</strong><div class="price-filters"></div></div>
      <div class="price-table-wrap"><table class="price-table"><thead><tr><th>Program</th><th>Boost<br>8×</th><th class="growth">Growth<br>16×</th><th>Mastery<br>32×</th></tr></thead><tbody></tbody></table></div>
      <div class="price-mobile-list"></div>
      <div class="price-facilities"><h3>Semua paket mendapatkan</h3><div class="price-facility-grid"><div class="price-facility">Jadwal fleksibel, menyesuaikan waktu murid</div><div class="price-facility">Materi sesuai kebutuhan dan kesulitan belajar</div><div class="price-facility">Dibimbing sampai benar-benar paham</div><div class="price-facility">Pilihan tutor dari kampus TOP dan kampus favorit lainnya</div><div class="price-facility">Report belajar setiap pertemuan</div><div class="price-facility">Analisa belajar setiap bulan</div></div><div class="price-cta"><a href="https://wa.me/${WA}?text=Halo%20Tutorin,%20saya%20ingin%20konsultasi%20tentang%20paket%20privat." target="_blank" rel="noreferrer">Konsultasikan kebutuhan belajar →</a></div></div>
    `;
    heading.insertAdjacentElement('afterend',catalog);

    const categories=['Semua','SD','SMP','SMA','TKA','SNBT','Olimpiade','Kuliah'];
    const filters=catalog.querySelector('.price-filters');
    const tbody=catalog.querySelector('tbody');
    const mobile=catalog.querySelector('.price-mobile-list');

    const render=category=>{
      const visible=category==='Semua'?prices:prices.filter(row=>row[4]===category);
      tbody.innerHTML=visible.map(row=>`<tr><td>${row[0]}</td><td>${format(row[1])}</td><td class="growth">${format(row[2])}</td><td>${format(row[3])}</td></tr>`).join('');
      mobile.innerHTML=visible.map(row=>`<article class="price-mobile-card"><h4>${row[0]}</h4><div class="price-mobile-options"><div class="price-mobile-option"><span>🚀 Boost 8×</span><strong>${format(row[1])}</strong></div><div class="price-mobile-option growth"><span>⭐ Growth 16×</span><strong>${format(row[2])}</strong></div><div class="price-mobile-option"><span>👑 Mastery 32×</span><strong>${format(row[3])}</strong></div></div></article>`).join('');
      filters.querySelectorAll('.price-filter').forEach(btn=>btn.classList.toggle('active',btn.dataset.category===category));
    };
    categories.forEach(category=>{
      const btn=document.createElement('button');
      btn.type='button';btn.className='price-filter';btn.dataset.category=category;btn.textContent=category;
      btn.addEventListener('click',()=>render(category));
      filters.appendChild(btn);
    });
    render('Semua');
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();

// The final homepage CTA should offer one clear action: WhatsApp consultation.
(function simplifyFinalCta(){
  const apply=()=>{
    const heading=[...document.querySelectorAll('h1,h2,h3')].find(el=>el.textContent.trim().toLowerCase()==='belum yakin harus mulai dari mana?');
    if(!heading) return;
    const section=heading.closest('section') || heading.parentElement;
    if(!section) return;
    [...section.querySelectorAll('a,button')].forEach(el=>{
      if(el.textContent.trim().toLowerCase().startsWith('cek kebutuhan anak')) el.remove();
    });
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
