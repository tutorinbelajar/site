import { Suspense } from 'react';
import SignupForm from '@/components/SignupForm';
export default function RegisterPage(){return <Suspense fallback={<div className="section"><div className="container">Memuat formulir…</div></div>}><SignupForm/></Suspense>}
