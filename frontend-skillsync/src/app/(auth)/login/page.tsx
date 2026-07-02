// src/app/(auth)/login/page.tsx
import { LoginForm } from '@/app/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-slate-900">Inicia sesión</h1>
        <LoginForm />
      </div>
    </main>
  );
}