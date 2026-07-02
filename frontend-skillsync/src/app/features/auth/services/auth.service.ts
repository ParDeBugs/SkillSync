const API_URL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:3000

export interface AuthUser {
  id: number;
  nombre_completo: string;
  correo_electronico: string;
  rol: 'ADMIN' | 'ESPECIALISTA' | 'CLIENTE';
}

interface LoginPayload {
  correo_electronico: string;
  contrasena: string;
}

interface RegisterClientePayload {
  nombre_completo: string;
  correo_electronico: string;
  contrasena: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? 'Ocurrió un error inesperado');
  return data as T;
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ usuario: AuthUser }> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // envía/recibe la cookie httpOnly
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async registerCliente(payload: RegisterClientePayload): Promise<{ usuario: AuthUser }> {
    const res = await fetch(`${API_URL}/auth/register/cliente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async logout(): Promise<void> {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
  },

  async me(): Promise<AuthUser | null> {
    const res = await fetch(`${API_URL}/auth/me`, { method: 'POST', credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.usuario;
  },
};