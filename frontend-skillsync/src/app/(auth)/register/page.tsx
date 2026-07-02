// src/app/(auth)/register/page.tsx
import { RegisterForm } from '@/app/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-slate-900">Crea tu cuenta</h1>
        <RegisterForm />
      </div>
    </main>
  );
}