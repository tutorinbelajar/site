import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

function LoginFallback() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="card form-card">
          <div>
            <div className="eyebrow">Akun Tutorin</div>
            <h1>Masuk</h1>
            <p style={{ color: 'var(--muted)' }}>Memuat halaman masuk…</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
