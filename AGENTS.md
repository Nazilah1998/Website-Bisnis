# ZilyaDigital — Panduan Agent

Repositori ini SUDAH berpindah arsitektur. Jangan menulis kode Next.js/Drizzle; keduanya telah dihapus.

- `frontend/` = **Astro 7** (SSR via `@astrojs/node`) + **React 19 islands** + Tailwind v4 + `@base-ui/react`. UI internal memakai pola Reka UI (ui primitives di `src/components/ui/`).
- `backend/` = **Go Fiber v3** API + **Air** live-reload; semua data di **PocketBase** (migrasi di `backend/pocketbase/pb_migrations`).
- Halaman publik alias id/en (`/` dan `/en/...`), rute admin di `frontend/src/pages/{admin,en/admin}/...`, rute client di `frontend/src/pages/{client,en/client}/...`.
- Fetch dua jalur:
  - Server-side (Astro server code): `src/lib/server.ts` → langsung ke `BACKEND_URL`.
  - Browser: `src/lib/api.ts` → proxy `/api/*` via `frontend/src/pages/api/[...path].ts`.
- Secrets & Environment Variables: Terpusat di **Infisical Cloud** (folder `/Website-Bisnis`, env `dev` / `prod`). Di dev diinjeksi via `scripts/infisical-env.mjs`. Di Docker produksi diinjeksi via Infisical CLI di `docker-entrypoint.sh` menggunakan Universal Auth (Zero Hardcode). Jangan gunakan berkas `.env` lokal atau meng-hardcode token.
- Deployment & Docker: Multi-stage `Dockerfile` menyatukan Go Fiber v3 (port internal `8080`) dan Astro 7 SSR (port listening eksternal `3000`) dalam satu container runtime. Healthcheck tersedia di `/health` pada port `3000`.
- Untuk tugas frontend, baca panduan Astro resmi di `frontend/node_modules/astro/dist/docs/` atau situs Astro sebelum menulis kode; perhatikan breaking changes Astro 7. Untuk backend, baca `backend/cmd/server/main.go` dan `backend/internal/handlers/` untuk kontrak API persis.