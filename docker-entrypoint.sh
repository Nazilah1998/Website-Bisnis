#!/bin/bash
set -e

# ========================================================
# ZilyaDigital Infisical Runtime Entrypoint
# Zero-hardcode secrets injected directly at runtime
# ========================================================

API_DOMAIN="${INFISICAL_API_URL:-${INFISICAL_HOST_URL:-https://app.infisical.com/api}}"
ENV_TARGET="${INFISICAL_ENV:-prod}"
PROJECT_ID="${INFISICAL_PROJECT_ID:-4dc09f19-337c-473f-9797-a8893fc11254}"
CLIENT_ID="${INFISICAL_CLIENT_ID:-$INFISICAL_UNIVERSAL_AUTH_CLIENT_ID}"
CLIENT_SECRET="${INFISICAL_CLIENT_SECRET:-$INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET}"
SECRET_PATH="${INFISICAL_SECRET_PATH:-/Website-Bisnis}"

# Pastikan API_DOMAIN berakhiran /api untuk Infisical CLI
case "$API_DOMAIN" in
    */api) ;;
    *) API_DOMAIN="${API_DOMAIN%/}/api" ;;
esac

TOKEN="$INFISICAL_TOKEN"

# Login headless via Universal Auth (Machine Identity) bila kredensial tersedia
if [ -z "$TOKEN" ] && [ -n "$CLIENT_ID" ] && [ -n "$CLIENT_SECRET" ]; then
    echo "[Infisical] Authenticating via Universal Auth..."
    TOKEN=$(infisical login --method=universal-auth --client-id="$CLIENT_ID" --client-secret="$CLIENT_SECRET" --domain="$API_DOMAIN" --plain --silent 2>/dev/null || true)
fi

TARGET_EXEC="${1:-/app/run.sh}"
if [ "$#" -gt 0 ]; then
    shift
fi

if [ -n "$TOKEN" ]; then
    echo "[Infisical] Starting application with secrets injected from ${SECRET_PATH} [${ENV_TARGET}]..."
    PROJECT_ARG=""
    if [ -n "$PROJECT_ID" ]; then
        PROJECT_ARG="--projectId=$PROJECT_ID"
    fi
    exec infisical run --token="$TOKEN" --domain="$API_DOMAIN" --env="$ENV_TARGET" $PROJECT_ARG --path="$SECRET_PATH" --silent -- "$TARGET_EXEC" "$@"
else
    echo "[Infisical] No Infisical credentials found. Running directly with existing environment variables..."
    exec "$TARGET_EXEC" "$@"
fi
