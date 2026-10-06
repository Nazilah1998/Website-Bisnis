// Fetch server-side (Astro server components) langsung ke backend Go.
// Browser-side memakai /api/* via proxy (lib/api.ts).

import { getEnv } from './env';

// Variabel env dibaca dari SATU file .env di root repo (lihat lib/env.ts).
const BACKEND_URL = getEnv('BACKEND_URL', 'http://127.0.0.1:8080').replace(/\/$/, '');

export class ServerApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message || 'Terjadi kesalahan');
    this.name = 'ServerApiError';
    this.status = status;
  }
}

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, init);
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
    const record = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
    const message = typeof record.error === 'string' ? record.error : `HTTP ${res.status}`;
    throw new ServerApiError(message, res.status);
  }
  if (data && typeof data === 'object' && 'success' in (data as Record<string, unknown>)) {
    const record = data as Record<string, unknown>;
    if (record.success === false) {
      throw new ServerApiError(String(record.error ?? 'Gagal'), res.status);
    }
  }
  return data as T;
}

/** Admin GET dengan meneruskan cookie admin_token (backend memvalidasi sesi). */
export async function apiAdmin<T = unknown>(path: string, token: string): Promise<T> {
  return api<T>(path, { headers: { Cookie: `admin_token=${token}` } });
}

/** Client GET dengan meneruskan cookie client_token (backend memvalidasi sesi). */
export async function apiClient<T = unknown>(path: string, token: string): Promise<T> {
  return api<T>(path, { headers: { Cookie: `client_token=${token}` } });
}

export interface PublicQuery {
  sort?: string;
  filter?: string;
}

/** GET /api/public/:collection?sort=&filter= → array record DTO (kunci camelCase). */
export async function getPublic<T = Record<string, unknown>>(collection: string, query: PublicQuery = {}): Promise<T[]> {
  const params = new URLSearchParams();
  if (query.sort) params.set('sort', query.sort);
  if (query.filter) params.set('filter', query.filter);
  const qs = params.toString();
  return api<T[]>(`/api/public/${collection}${qs ? `?${qs}` : ''}`);
}