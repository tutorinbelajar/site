import type { Program } from '@/data/programs';
import { createPublicClient } from '@/lib/supabase/public';

export async function getPublishedPrograms(): Promise<Program[]> {
  const sb=createPublicClient();
  const {data,error}=await sb.from('tutorin_programs').select('id,slug,category,name,short_description,level,subject,tutorin_program_features(feature,sort_order),tutorin_program_packages(name,meetings,price,sort_order,status)').eq('status','published').order('sort_order',{ascending:true});
  if(error || !data?.length) return [];
  return data.map((p:any)=>({slug:p.slug,category:p.category,name:p.name,shortDescription:p.short_description||'',level:p.level||'',subject:p.subject||undefined,features:(p.tutorin_program_features||[]).sort((a:any,b:any)=>a.sort_order-b.sort_order).map((x:any)=>x.feature),packages:(p.tutorin_program_packages||[]).filter((x:any)=>x.status==='published').sort((a:any,b:any)=>a.sort_order-b.sort_order).map((x:any)=>({name:x.name,meetings:Number(x.meetings||0),price:Number(x.price||0)}))}));
}
