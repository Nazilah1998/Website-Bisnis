// Hub pemanggilan API frontend -> proxy /api/* -> backend Go (Fiber).
// Semua fungsi mengembalikan Promise yang REJECT dengan ApiError bila gagal,
// termasuk bentuk HTTP 200 {success:false, error} dari endpoint admin CRUD.

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message || 'Terjadi kesalahan');
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: BodyInit | Record<string, unknown> | FormData | null;
  headers?: Record<string, string>;
}

export async function request<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers } = options;

  const init: RequestInit = {
    method,
    headers: { ...(headers ?? {}) },
    credentials: 'same-origin',
  };

  if (body != null) {
    if (body instanceof FormData) {
      init.body = body;
    } else if (typeof body === 'string' || body instanceof Blob || body instanceof ArrayBuffer) {
      init.body = body;
    } else {
      init.headers = { ...init.headers, 'Content-Type': 'application/json' };
      init.body = JSON.stringify(body);
    }
  }

  const res = await fetch(path, init);

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message = extractError(data) ?? `Request gagal (${res.status})`;
    throw new ApiError(message, res.status);
  }

  // Endpoint CRUD admin mengembalikan HTTP 200 {success:false,error}
  // (kontrak lama: pesan error tetap muncul sebagai toast).
  if (data && typeof data === 'object' && 'success' in (data as Record<string, unknown>)) {
    const record = data as Record<string, unknown>;
    if (record.success === false) {
      throw new ApiError(`${record.error ?? 'Gagal'}`, 200);
    }
  }

  return data as T;
}

function extractError(data: unknown): string | null {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.error === 'string') return record.error;
    if (typeof record.message === 'string') return record.message;
    if (typeof record.success === 'object' && record.success !== null) {
      return extractError(record.success);
    }
  }
  return null;
}

/** GET dengan query params sederhana. */
export function get<T = unknown>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const url = new URL(path, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
    }
  }
  return request<T>(`${url.pathname}${url.search}`);
}

/** POST alias. */
export function post<T = unknown>(path: string, body?: ApiOptions['body']): Promise<T> {
  return request<T>(path, { method: 'POST', body });
}

/** PUT alias (mayoritas dipakai untuk toggle/status via go). */
export function put<T = unknown>(path: string, body?: ApiOptions['body']): Promise<T> {
  return request<T>(path, { method: 'PUT', body });
}

export function del<T = unknown>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}

// --- Helper DTO backend (tampilkan persis seperti objek Drizzle lama) ---

export type LocalizedItem = Record<string, unknown> & {
  id: string;
  createdAt?: string;
  [key: string]: unknown;
};

export type RecordId = string;

export interface LoginResult {
  success: boolean;
}

export interface MessageResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface LeadCreated {
  id: string;
  success: boolean;
}

/** Konversi string tanggal PB ("2026-10-06 15:36:00.306Z") ke Date (aman). */
export function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Helper isi greeting/titleId pola lama: id vs en. */
export function pickLocale<T>(locale: string, idValue: T, enValue: T): T {
  return locale === 'en' ? enValue : idValue;
}