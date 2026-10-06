// Loader variabel env satu file dari ROOT repo (.env / .env.local).
// Backend Go membaca "../.env" via godotenv; frontend memakai loader ini
// sehingga keduanya cukup diatur dari SATU file .env di root.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_ENV_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env');
const ROOT_ENV_LOCAL = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env.local');

// PORT dipesan untuk proses server node itu sendiri (baca dari env OS / CLI),
// bukan dari file ini, agar tidak bentrok dengan port API backend (backend juga
// membaca PORT dari root .env via godotenv).
const SKIPPED_KEYS = new Set(['PORT', 'NODE_ENV']);

let loaded = false;

// Parse .env sederhana tanpa dependensi. Nilai yang SUDAH ada di process.env
// tidak ditimpa (prioritas: environment nyata > root .env.local > root .env).
function parseEnvFile(file: string): void {
  const text = readFileSync(file, 'utf8');
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    if (key in process.env || SKIPPED_KEYS.has(key)) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

export function loadRootEnv(): void {
  if (loaded) return;
  loaded = true;
  try {
    if (existsSync(ROOT_ENV_LOCAL)) parseEnvFile(ROOT_ENV_LOCAL);
    if (existsSync(ROOT_ENV_FILE)) parseEnvFile(ROOT_ENV_FILE);
  } catch {
    // abaikan bila file tidak terbaca
  }
}

export function getEnv(key: string, fallback = ''): string {
  loadRootEnv();
  const value = process.env[key];
  return value && value.length > 0 ? value : fallback;
}

loadRootEnv();