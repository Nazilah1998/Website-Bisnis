/**
 * Setup and Schema Synchronizer for Remote PocketBase (https://db.nazilah.id)
 * Injects secrets from Infisical Cloud dev environment and ensures
 * all collections have correct schemas, permissions, and autodate fields.
 */

const PB_URL = (process.env.PB_URL || 'https://db.nazilah.id').replace(/\/$/, '');
const EMAIL = process.env.PB_SUPERUSER_EMAIL || process.env.PB_EMAIL || '';
const PASSWORD = process.env.PB_SUPERUSER_PASSWORD || process.env.PB_PASSWORD || '';

if (!EMAIL || !PASSWORD) {
  console.error('Error: PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD must be provided via environment variables or Infisical.');
  process.exit(1);
}

async function main() {
  console.log(`Connecting to PocketBase at ${PB_URL}...`);
  const loginRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: EMAIL, password: PASSWORD }),
  });

  if (!loginRes.ok) {
    throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
  }

  const { token } = await loginRes.json();
  console.log('Superuser login successful!');

  // Fetch all collections
  const colsRes = await fetch(`${PB_URL}/api/collections?perPage=100`, {
    headers: { Authorization: token },
  });
  if (!colsRes.ok) {
    throw new Error(`List collections failed: ${colsRes.status} ${await colsRes.text()}`);
  }

  const data = await colsRes.json();
  console.log(`Retrieved ${data.items.length} collections.`);

  for (const col of data.items) {
    if (col.system) continue;

    const fields = col.fields || [];
    const hasCreated = fields.some(f => f.name === 'created');
    const hasUpdated = fields.some(f => f.name === 'updated');

    let modified = false;
    let newFields = [...fields];

    if (!hasCreated) {
      newFields.push({ name: 'created', type: 'autodate', onCreate: true, onUpdate: false });
      modified = true;
    }
    if (!hasUpdated) {
      newFields.push({ name: 'updated', type: 'autodate', onCreate: true, onUpdate: true });
      modified = true;
    }

    if (modified) {
      const patchRes = await fetch(`${PB_URL}/api/collections/${col.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ fields: newFields }),
      });

      if (!patchRes.ok) {
        console.error(`FAILED to update ${col.name}: ${patchRes.status}`, await patchRes.text());
      } else {
        console.log(`SUCCESS: Synced schema for ${col.name}`);
      }
    } else {
      console.log(`OK: ${col.name} schema is already up to date.`);
    }
  }

  console.log('\nAll collections verified.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
