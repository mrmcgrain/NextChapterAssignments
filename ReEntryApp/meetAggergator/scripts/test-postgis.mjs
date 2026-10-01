import { Pool } from 'pg';
import { spawnSync } from 'node:child_process';
process.loadEnvFile('.env');
const url = new URL(process.env.DATABASE_URL);
if (!['localhost','127.0.0.1'].includes(url.hostname)) throw new Error('Local test setup only supports a local database.');
const admin = new URL(url);admin.pathname='/postgres';
const pool = new Pool({connectionString:admin.toString()});
try {
  if (!(await pool.query("SELECT 1 FROM pg_database WHERE datname='recovery_test'")).rowCount)
    await pool.query('CREATE DATABASE recovery_test');
} finally {await pool.end();}
url.pathname='/recovery_test';
const env={...process.env,DATABASE_URL:url.toString(),TEST_DATABASE_URL:url.toString()};
for (const args of [['--import','tsx','apps/api/src/migrate.ts'],['node_modules/vitest/vitest.mjs','run']]) {
  const result=spawnSync(process.execPath,args,{env,stdio:'inherit'});
  if(result.status !== 0) process.exit(result.status ?? 1);
}
