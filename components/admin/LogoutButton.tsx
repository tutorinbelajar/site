'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
export default function LogoutButton(){const router=useRouter();return <button className="admin-logout" onClick={async()=>{await createClient().auth.signOut();router.replace('/login')}}>Keluar</button>}
