'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { useSession } from '@/app/core/services/session.service';
import { ApiError } from '@/app/core/interceptors/http-client';

type TipoCuenta = 'CLIENTE' | 'ESPECIALISTA';

export function RegisterForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const [tipoCuenta, setTipoCuenta] = useState<TipoCuenta>('CLIENTE');
  const [nombre_completo, setNombre] = useState('');
  const [correo_electronico, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [acceptedPrivacyNotice, setAcceptedPrivacyNotice] = useState(false); // nunca true por defecto
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (nombre_completo.trim().length < 2) return 'Ingresa tu nombre completo';
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
      const payload = { nombre_completo: nombre_completo.trim(), correo_electronico, contrasena };

      if (tipoCuenta === 'CLIENTE') {
        await authService.registerCliente(payload);
      } else {
        await authService.registerEspecialista(payload);
      }

      await refresh();
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.details?.length ? err.details.join(' ') : err.message);
      } else {
        setError('No se pudo completar el registro. Intenta de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = acceptedPrivacyNotice && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4" noValidate>
      <fieldset>
        <legend className="text-sm font-medium text-slate-700">Quiero registrarme como</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTipoCuenta('CLIENTE')}
            aria-pressed={tipoCuenta === 'CLIENTE'}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              tipoCuenta === 'CLIENTE'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-300 text-slate-600 hover:border-slate-400'
            }`}
          >
            Cliente
          </button>
          <button
            type="button"
            onClick={() => setTipoCuenta('ESPECIALISTA')}
            aria-pressed={tipoCuenta === 'ESPECIALISTA'}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              tipoCuenta === 'ESPECIALISTA'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-300 text-slate-600 hover:border-slate-400'
            }`}
          >
            Especialista
          </button>
        </div>
        {tipoCuenta === 'ESPECIALISTA' && (
          <p className="mt-2 text-xs text-slate-500">
            Después de crear tu cuenta, deberás completar la verificación de tu oficio.
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="nombre" className="text-sm font-medium text-slate-700">Nombre completo</label>
        <input
          id="nombre"
          type="text"
          required
          value={nombre_completo}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
        />
      </div>

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
          autoComplete="new-password"
          required
          minLength={6}
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={acceptedPrivacyNotice}
          onChange={(e) => setAcceptedPrivacyNotice(e.target.checked)}
          className="mt-1"
        />
        <span>
          He leído y acepto el{' '}
          <a href="/aviso-de-privacidad" target="_blank" className="text-indigo-600 underline">
            Aviso de Privacidad
          </a>
        </span>
      </label>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  );
}