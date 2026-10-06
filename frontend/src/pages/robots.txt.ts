import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /client/dashboard/\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
};