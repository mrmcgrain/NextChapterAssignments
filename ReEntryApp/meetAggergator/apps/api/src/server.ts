import { Pool } from 'pg';
import { buildApp } from './app.js';
import { Repository } from './repository.js';
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL before starting the API');
const pool = new Pool({connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 3000});
const app = buildApp(new Repository(pool));
await app.listen({port: Number(process.env.PORT ?? 3001), host: '0.0.0.0'});
console.log(`Meeting API listening on port ${process.env.PORT ?? 3001}`);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await app.close(); await pool.end(); process.exit(0); });
