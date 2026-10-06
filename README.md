# ZilyaDigital — Monorepo

Repositori ini hanya memuat **dua folder utama**: `frontend/` (Astro) dan `backend/` (Go + PocketBase). Seluruh kode Next.js/Drizzle lama sudah dihapus.

## Struktur

```
Website-Bisnis/
├── frontend/                  # Astro 7 SSR + React 19 islands + Tailwind v4
│   ├── src/
│   │   ├── components/        # komponen (UI + islands React)
│   │   ├── layouts/           # Layout.astro (public), AdminShell
│   │   ├── lib/               # server.ts (fetch ke backend), api.ts (proxy), guards, records
│   │   ├── pages/             # halaman id + en (public, /admin/*, /client/*, api proxy)
│   │   └── i18n/              # ui.ts, utils.ts
│   ├── public/                # aset statis (logo.jpg, dll)
│   ├── astro.config.mjs
│   └── package.json
├── backend/                   # Go Fiber API
│   ├── cmd/server/main.go     # entrypoint + seluruh rute
│   ├── internal/              # config, handlers (admin, client, doku, public, auth)
│   ├── pocketbase/            # Dockerfile, docker-compose.yml, pb_migrations
│   ├── scripts/               # seed.ts (seed PocketBase, tanpa dependensi npm)
│   ├── go.mod
│   └── go.sum
├── AGENTS.md
├── README.md
└── .gitignore
```

## Menjalankan (lokal)

0. **Environment Variables — Terintegrasi dengan Infisical Cloud**:
   - Seluruh variabel lingkungan dikelola terpusat di **Infisical Cloud** (Folder `/Website-Bisnis`, Environment `dev`).
   - Tidak memerlukan berkas `.env` lokal. Saat menjalankan `npm run dev`, seluruh secret diinjeksi secara otomatis ke proses runtime melalui script runner `scripts/infisical-env.mjs`.
   - Konfigurasi referensi template tetap tercatat di `.env.example`.

1. **PocketBase** (database):
   ```
   cd backend/pocketbase
   docker compose up -d
   # atau jalankan binary:
   # pocketbase serve --http=127.0.0.1:8090
   ```
   Migrasi schema otomatis dijalankan oleh PocketBase dari `pb_migrations`. Seed data opsional:
   ```
   cd backend
   node scripts/seed.ts
   ```

2. **Menjalankan Sekaligus (Frontend + Backend Air Reload via Concurrently)**:
   ```
   npm run dev          # Menjalankan FE (port 3000) & BE (Air reload) secara bersamaan
   ```
   Atau jalankan terpisah:
   - **Backend** (Go Fiber v3 + Air live reload, port 8080):
     ```
     npm run dev:be
     # atau: cd backend && air
     ```
   - **Frontend** (Astro port 3000):
     ```
     npm run dev:fe
     # atau: cd frontend && npm run dev
     ```
   `BACKEND_URL` dan `SITE_URL` dibaca dari root `.env`. Browser memanggil backend via proxy path `/api/*` (lihat `frontend/src/pages/api/[...path].ts`), jadi cookie sesi (`admin_token`, `client_token`) bekerja same-origin.

## Akun bawaan (hasil seed)

| Role  | Username/Email | Password    |
|-------|----------------|-------------|
| Admin | `admin`        | `admin123456` |
| Klien | `budi@tokobagus.co.id` | `demo1234` |

## Alur pembayaran
`frontend` → `POST /api/doku/checkout` (proxy ke backend) → generate sesi DOKU → `{payment_url}` ditampilkan dalam iframe. Webhook `POST /api/doku/webhook` menandai invoice `paid`. Butuh env `DOKU_CLIENT_ID` dan `DOKU_SECRET_KEY` agar berfungsi; tanpa itu checkout mengembalikan galat.