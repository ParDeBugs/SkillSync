import { httpClient, ApiError } from '@/app/core/interceptors/http-client';

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

interface RegisterPayload {
  nombre_completo: string;
  correo_electronico: string;
  contrasena: string;
}

export const authService = {
  login(payload: LoginPayload) {
    return httpClient.post<{ usuario: AuthUser }>('/auth/login', payload);
  },

  registerCliente(payload: RegisterPayload) {
    return httpClient.post<{ usuario: AuthUser }>('/auth/register/cliente', payload);
  },

  registerEspecialista(payload: RegisterPayload) {
    return httpClient.post<{ usuario: AuthUser }>('/auth/register/especialista', payload);
  },

  logout() {
    return httpClient.post<{ ok: boolean }>('/auth/logout');
  },

  async me(): Promise<AuthUser | null> {
    try {
      const data = await httpClient.post<{ usuario: AuthUser }>('/auth/me');
      return data.usuario;
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 0)) return null;
      console.error(err);
      return null;
    }
  },
};