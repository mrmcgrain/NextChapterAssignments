import { Pool } from 'pg';
import { sourceRegistry } from './sources/registry.js';
import { syncSource } from './sync.js';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const args = process.argv.slice(2);
const source = args.find(arg => !arg.startsWith('--')) ?? 'all';
if (source !== 'all' && !(source in sourceRegistry)) throw new Error(`Unknown source. Choose all or ${Object.keys(sourceRegistry).join(', ')}.`);
if (process.env.NODE_ENV === 'production') throw new Error('Production sync disabled until source redistribution permission is recorded.');
const pool = new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:3000});
try {
  const selected = Object.entries(sourceRegistry).filter(([slug]) => source === 'all' || slug === source);
  for (const [slug, definition] of selected) {
    try {
      if (args.includes('--register-development')) {
        await pool.query(`INSERT INTO sources(name,slug,base_url,approved,enabled,attribution,notes)
          VALUES($1,$2,$3,true,true,$4,'Approved local development integration; public redistribution terms pending.')
          ON CONFLICT(slug) DO NOTHING`,[definition.name,slug,definition.url,definition.attribution]);
      }
      const result = await pool.query('SELECT id,enabled,approved FROM sources WHERE slug=$1',[slug]);
      if (!result.rows[0]) throw new Error('Source not registered');
      if (!result.rows[0].enabled || !result.rows[0].approved) {console.log({source:slug,status:'disabled'});continue;}
      console.log({source:slug,status:'completed',...await syncSource(pool,result.rows[0].id,definition.adapter)});
    } catch {console.error({source:slug,status:'failed',message:'Source sync failed; existing meetings preserved.'});process.exitCode=1;}
  }
} finally { await pool.end(); }
