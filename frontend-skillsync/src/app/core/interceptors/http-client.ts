const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      credentials: 'include', // siempre envía/recibe la cookie httpOnly
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch {
    // fetch solo lanza excepción por falla de red o bloqueo de CORS,
    // nunca por códigos de estado HTTP (esos se manejan abajo)
    throw new ApiError(
      'No se pudo conectar con el servidor. Verifica tu conexión o inténtalo más tarde.',
      0,
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw mapErrorResponse(res.status, data);
  }

  return data as T;
}

function mapErrorResponse(status: number, data: any): ApiError {
  const rawMessage = data?.message;
  // class-validator devuelve un arreglo de strings cuando falla ValidationPipe
  const details = Array.isArray(rawMessage) ? rawMessage : undefined;
  const singleMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;

  switch (status) {
    case 400:
      return new ApiError(singleMessage ?? 'Los datos enviados no son válidos.', status, details);
    case 401:
      return new ApiError('Correo o contraseña incorrectos.', status);
    case 403:
      return new ApiError('No tienes permiso para realizar esta acción.', status);
    case 404:
      return new ApiError('El recurso solicitado no existe.', status);
    case 409:
      return new ApiError(singleMessage ?? 'El correo ya está registrado.', status);
    case 429:
      return new ApiError('Demasiados intentos. Intenta de nuevo en unos minutos.', status);
    default:
      return new ApiError('Ocurrió un error inesperado en el servidor. Intenta más tarde.', status);
  }
}

export const httpClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
};