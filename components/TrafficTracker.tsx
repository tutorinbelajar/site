'use client';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
export default function TrafficTracker(){useEffect(()=>{try{const key='tutorin_visitor_id';let visitor=localStorage.getItem(key);if(!visitor){visitor=crypto.randomUUID();localStorage.setItem(key,visitor)}const sb=createClient();sb.from('tutorin_traffic_events').insert({event_name:'page_view',path:window.location.pathname,visitor_id:visitor,referrer:document.referrer||null}).then(()=>{});}catch{}},[]);return null}
