#!/bin/bash
set -e

# ========================================================
# ZilyaDigital Container Process Supervisor
# Runs Go Fiber v3 API on internal port 8080
# Runs Astro 7 SSR Frontend on external port 3000
# ========================================================

export PORT="${APP_PORT:-${PORT:-3000}}"

# Jika Infisical menyuntikkan PORT=8080 (port backend default),
# pastikan port Astro tetap 3000 agar tidak konflik
if [ "$PORT" = "8080" ]; then
    export BACKEND_PORT=8080
    export PORT=3000
fi

export BACKEND_PORT="${BACKEND_PORT:-8080}"
export BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:${BACKEND_PORT}}"
export HOST="0.0.0.0"

echo "[Supervisor] Starting Go Backend on 127.0.0.1:${BACKEND_PORT}..."
/app/bin/server &
BACKEND_PID=$!

cleanup() {
    echo "[Supervisor] Received termination signal, stopping processes..."
    if [ -n "$FRONTEND_PID" ]; then
        kill -TERM "$FRONTEND_PID" 2>/dev/null || true
    fi
    if [ -n "$BACKEND_PID" ]; then
        kill -TERM "$BACKEND_PID" 2>/dev/null || true
    fi
    wait "$BACKEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT SIGQUIT

# Tunggu backend siap sebelum memulai Astro
echo "[Supervisor] Waiting for Backend to be healthy..."
for i in $(seq 1 30); do
    if curl -s "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null 2>&1; then
        echo "[Supervisor] Backend is ready and healthy!"
        break
    fi
    sleep 0.5
done

echo "[Supervisor] Starting Astro Frontend on 0.0.0.0:${PORT}..."
cd /app/frontend
node dist/server/entry.mjs &
FRONTEND_PID=$!

# Tunggu sampai salah satu proses berhenti
wait -n "$BACKEND_PID" "$FRONTEND_PID"
EXIT_CODE=$?
cleanup
exit $EXIT_CODE
