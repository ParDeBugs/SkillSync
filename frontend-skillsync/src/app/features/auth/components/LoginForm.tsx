'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '../services/auth.service';
import { useSession } from '@/app/core/services/session.service';

export function LoginForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const [correo_electronico, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) return 'Correo inválido';
    if (contrasena.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) return setError(validationError);

    setIsSubmitting(true);
    try {
      await authService.login({ correo_electronico, contrasena });
      await refresh();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4" noValidate>
      <div>
        <label htmlFor="correo" className="text-sm font-medium text-slate-700">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          autoComplete="email"
          required
          value={correo_electronico}
          onChange={(e) => setCorreo(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
        />
      </div>

      <div>
        <label htmlFor="contrasena" className="text-sm font-medium text-slate-700">Contraseña</label>
        <input
          id="contrasena"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
        />
      </div>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Entrando…' : 'Iniciar sesión'}
      </button>

      <p className="text-center text-sm text-slate-600">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="font-medium text-indigo-600 underline">
          Crea una aquí
        </Link>
      </p>
    </form>
  );
}