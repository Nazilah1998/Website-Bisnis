import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Prevent multiple connections during hot-reloading in development
const globalForDb = globalThis as unknown as {
  client: postgres.Sql | undefined;
};

// Batasi jumlah koneksi maksimal di pool untuk mencegah error "too many clients"
export const client = globalForDb.client ?? postgres(connectionString, { max: 1, prepare: false });

if (process.env.NODE_ENV !== 'production') globalForDb.client = client;

export const db = drizzle(client, { schema });
