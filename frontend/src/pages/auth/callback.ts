import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';

export const prerender = false;

const BACKEND_URL = getEnv('BACKEND_URL', 'http://127.0.0.1:8080').replace(/\/$/, '');

export const GET: APIRoute = async ({ request, url }) => {
  const target = `${BACKEND_URL}/api/auth/google/callback${url.search}`;

  const headers = new Headers();
  const cookie = request.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);

  const upstream = await fetch(target, {
    method: 'GET',
    headers,
    redirect: 'manual',
  });

  const outHeaders = new Headers();
  const setCookies: string[] =
    typeof upstream.headers.getSetCookie === 'function'
      ? upstream.headers.getSetCookie()
      : (upstream.headers.get('set-cookie') ?? '').split(/,(?![^;]*;)/).filter(Boolean);
  for (const sc of setCookies) outHeaders.append('set-cookie', sc);

  const location = upstream.headers.get('location') || '/client/dashboard';
  outHeaders.set('location', location);

  return new Response(null, {
    status: upstream.status || 302,
    headers: outHeaders,
  });
};
