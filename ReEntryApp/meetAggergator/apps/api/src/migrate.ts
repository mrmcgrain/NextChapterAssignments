import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(001001)');
  await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz DEFAULT now())');
  for (const name of ['001_initial', '002_search_diagnostics', '003_timezone_cache']) {
  if (!(await client.query('SELECT name FROM schema_migrations WHERE name=$1', [name])).rowCount) {
    await client.query(await readFile(new URL(`../../../database/migrations/${name}.sql`, import.meta.url), 'utf8'));
    await client.query('INSERT INTO schema_migrations(name) VALUES($1)', [name]);
  }
  }
  await client.query('COMMIT');
  console.log('Database migrations applied.');
} catch (error) { await client.query('ROLLBACK'); throw error; }
finally { client.release(); await pool.end(); }


