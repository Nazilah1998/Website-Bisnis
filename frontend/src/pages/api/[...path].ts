import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';

// Proxy semua /api/* ke backend Go (Fiber). Cookie diteruskan dua arah
// (auth admin/client di-set oleh Go lewat Set-Cookie).
export const prerender = false;

const BACKEND_URL = getEnv('BACKEND_URL', 'http://127.0.0.1:8080').replace(/\/$/, '');

const PASSTHROUGH_HEADERS = new Set([
  'content-type',
  'content-length',
  'transfer-encoding',
  'cache-control',
  'expires',
  'pragma',
  'location',
  'www-authenticate',
  'server',
  'retry-after',
]);

export const ALL: APIRoute = async ({ request, params, url }) => {
  const path = Array.isArray(params.path) ? params.path.join('/') : (params.path ?? '');
  const target = `${BACKEND_URL}/api/${path}${url.search}`;

  const headers = new Headers();
  const cookie = request.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);

  const method = request.method;
  let body: BodyInit | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    const contentType = request.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);
    // FormData boleh lewat apa adanya; selain itu kirim sebagai arrayBuffer.
    if (contentType?.includes('multipart/form-data')) {
      body = await request.formData();
    } else {
      body = await request.arrayBuffer();
    }
  }

  const upstream = await fetch(target, { method, headers, body, redirect: 'manual' });

  const outHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (PASSTHROUGH_HEADERS.has(key.toLowerCase())) outHeaders.set(key, value);
  });

  // Set-Cookie bisa jamak — gunakan getSetCookie jika tersedia.
  const setCookies: string[] =
    typeof upstream.headers.getSetCookie === 'function'
      ? upstream.headers.getSetCookie()
      : (upstream.headers.get('set-cookie') ?? '').split(/,(?![^;]*;)/).filter(Boolean);
  for (const sc of setCookies) outHeaders.append('set-cookie', sc);

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: outHeaders,
  });
};