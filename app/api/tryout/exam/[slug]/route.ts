import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const slugPattern=/^[a-z0-9-]{2,100}$/;
async function getSupabase() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) throw new Error('Supabase belum dikonfigurasi.');
  const store=await cookies();
  return createServerClient(url,key,{cookies:{getAll(){return store.getAll();},setAll(values){try{values.forEach(({name,value,options})=>store.set(name,value,options));}catch{/* Server Component may not permit cookie writes. */}}}});
}

export async function POST(request:NextRequest,{params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  if(!slugPattern.test(slug)) return NextResponse.json({error:'Paket tryout tidak valid.'},{status:400});
  let body:{code?:string};
  try{body=await request.json();}catch{return NextResponse.json({error:'Format permintaan tidak valid.'},{status:400});}
  const code=String(body.code||'').trim().toUpperCase();
  if(!code) return NextResponse.json({error:'Masukkan kode akses.'},{status:400});
  try {
    const sb=await getSupabase();
    const {data:{user},error:authError}=await sb.auth.getUser();
    if(authError||!user) return NextResponse.json({error:'Silakan masuk ke akun Tutorin terlebih dahulu.'},{status:401});
    const {data:exam}=await sb.from('tutorin_tryouts').select('id,slug').eq('slug',slug).eq('status','published').maybeSingle();
    if(!exam) return NextResponse.json({error:'Paket tryout tidak ditemukan atau belum dipublikasikan.'},{status:404});
    const {data:registration,error}=await sb.from('tutorin_tryout_registrations').select('id,status,unique_code,tryout_id').eq('user_id',user.id).eq('tryout_id',exam.id).eq('unique_code',code).eq('status','approved').maybeSingle();
    if(error||!registration) return NextResponse.json({error:'Kode tidak cocok dengan akun ini, atau pendaftaran belum disetujui.'},{status:403});
    const response=NextResponse.json({ok:true});
    response.cookies.set(`tutorin_exam_${slug}`,code,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:`/api/tryout/exam/${slug}`,maxAge:60*60*4});
    return response;
  } catch { return NextResponse.json({error:'Layanan akses ujian belum siap. Hubungi admin Tutorin.'},{status:503}); }
}

export async function GET(_request:NextRequest,{params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  if(!slugPattern.test(slug)) return new NextResponse('Paket tidak valid.',{status:400});
  try {
    const sb=await getSupabase();
    const {data:{user},error:authError}=await sb.auth.getUser();
    const jar=await cookies();
    const code=jar.get(`tutorin_exam_${slug}`)?.value||'';
    if(authError||!user||!code) return new NextResponse('Akses ditolak. Masuk dan verifikasi kode akses terlebih dahulu.',{status:401,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    const {data:exam}=await sb.from('tutorin_tryouts').select('id').eq('slug',slug).eq('status','published').maybeSingle();
    const {data:registration}=exam?await sb.from('tutorin_tryout_registrations').select('id').eq('user_id',user.id).eq('tryout_id',exam.id).eq('unique_code',code).eq('status','approved').maybeSingle():{data:null};
    if(!registration) return new NextResponse('Akses tidak sah atau persetujuan telah dicabut.',{status:403});
    const file=path.join(process.cwd(),'private-exams',slug,'index.html');
    let html=await readFile(file,'utf8');
    html=html.replace(/src=['"](TO SD [^'"]+\.png)['"]/g,(_match,filename)=>`src="/api/tryout/exam/${slug}/assets?file=${encodeURIComponent(filename)}"`);
    html=html.replace('</head>','<meta name="robots" content="noindex,nofollow"><meta http-equiv="Cache-Control" content="no-store"></head>');
    return new NextResponse(html,{status:200,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store, max-age=0','X-Robots-Tag':'noindex, nofollow'}});
  } catch { return new NextResponse('Konten ujian belum tersedia.',{status:404}); }
}
