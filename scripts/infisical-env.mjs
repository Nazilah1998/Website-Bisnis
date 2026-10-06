#!/usr/bin/env node

/**
 * Infisical Cloud Secret Injector for Website-Bisnis (ZilyaDigital)
 * Injects secrets directly from Personal Infisical Cloud without needing any local .env file.
 */

import { spawn } from 'node:child_process';

// Explicitly use this project's Personal Infisical configuration to avoid OS env variable collisions
const INFISICAL_API_URL = process.env.WEBSITE_INFISICAL_API_URL || 'https://app.infisical.com/api';
const INFISICAL_CLIENT_ID = process.env.WEBSITE_INFISICAL_CLIENT_ID || '6043c108-d81e-492f-ba0d-3ad4ce98bcc3';
const INFISICAL_CLIENT_SECRET = process.env.WEBSITE_INFISICAL_CLIENT_SECRET || '57abef1a80899387d39e990fb0f0fe7d3aa9f0fe3481d34dcb92c6206ac7b81e';
const INFISICAL_PROJECT_ID = process.env.WEBSITE_INFISICAL_PROJECT_ID || '4dc09f19-337c-473f-9797-a8893fc11254';
const INFISICAL_ENV = process.env.WEBSITE_INFISICAL_ENV || 'dev';
const INFISICAL_SECRET_PATH = process.env.WEBSITE_INFISICAL_SECRET_PATH || '/Website-Bisnis';

async function getInfisicalSecrets() {
  // 1. Authenticate with Universal Auth
  const loginRes = await fetch(`${INFISICAL_API_URL}/v1/auth/universal-auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: INFISICAL_CLIENT_ID,
      clientSecret: INFISICAL_CLIENT_SECRET,
    }),
  });

  if (!loginRes.ok) {
    const err = await loginRes.text();
    throw new Error(`Failed to authenticate with Infisical (${loginRes.status}): ${err}`);
  }

  const { accessToken } = await loginRes.json();

  // 2. Fetch secrets for target environment and folder
  const url = new URL(`${INFISICAL_API_URL}/v4/secrets`);
  url.searchParams.set('environment', INFISICAL_ENV);
  url.searchParams.set('secretPath', INFISICAL_SECRET_PATH);
  url.searchParams.set('projectId', INFISICAL_PROJECT_ID);
  url.searchParams.set('includeImports', 'true');
  url.searchParams.set('expandSecretReferences', 'true');

  const secretsRes = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!secretsRes.ok) {
    const err = await secretsRes.text();
    throw new Error(`Failed to fetch secrets from Infisical (${secretsRes.status}): ${err}`);
  }

  const data = await secretsRes.json();
  const secrets = {};
  if (Array.isArray(data.secrets)) {
    for (const s of data.secrets) {
      if (s.secretKey) {
        secrets[s.secretKey] = s.secretValue ?? '';
      }
    }
  }
  return secrets;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node scripts/infisical-env.mjs <command> [args...]');
    process.exit(1);
  }

  try {
    process.stdout.write(`\x1b[36m[Infisical]\x1b[0m Connecting to Infisical Cloud (${INFISICAL_SECRET_PATH} [${INFISICAL_ENV}])...\n`);
    const secrets = await getInfisicalSecrets();
    const count = Object.keys(secrets).length;
    process.stdout.write(`\x1b[32m[Infisical]\x1b[0m Injected ${count} secrets into environment.\n`);

    const env = {
      ...process.env,
      ...secrets,
    };

    const command = args[0];
    const commandArgs = args.slice(1);
    const isWin = process.platform === 'win32';
    const file = isWin ? (process.env.ComSpec || 'cmd.exe') : command;
    const cmdArgs = isWin ? ['/d', '/s', '/c', [command, ...commandArgs].join(' ')] : commandArgs;

    const child = spawn(file, cmdArgs, {
      env,
      stdio: 'inherit',
      windowsVerbatimArguments: isWin,
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
      } else {
        process.exit(code ?? 0);
      }
    });

    // Forward termination signals to child
    process.on('SIGINT', () => child.kill('SIGINT'));
    process.on('SIGTERM', () => child.kill('SIGTERM'));
  } catch (err) {
    console.error('\x1b[31m[Infisical Error]\x1b[0m', err.message);
    process.exit(1);
  }
}

main();
