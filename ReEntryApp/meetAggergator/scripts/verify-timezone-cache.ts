import { Pool } from 'pg';
import { createTimezoneResolver, type CachedTimezone } from '../apps/api/src/timezone.js';
import { syncSource } from '../apps/api/src/sync.js';
import { arizonaNaAdapter } from '../apps/api/src/sources/arizona-na.js';

async function main() {
const pool = new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:3000});
try {
  const before = (await pool.query('SELECT cache_key,timezone,method,resolved_at FROM timezone_location_cache ORDER BY cache_key')).rows;
  const cache = new Map<string,CachedTimezone>(before.map(row => [row.cache_key,{timezone:row.timezone,method:row.method}]));
  let geographicCalls = 0;
  const resolve = createTimezoneResolver(cache, () => { geographicCalls++; throw new Error('Saved resolution unexpectedly performed geographic lookup'); });
  for (const city of ['Phoenix','Tempe','Tucson']) {
    const result = resolve({city,state:'AZ',timezone:null}) as {timezone:string};
    if (result.timezone !== 'America/Phoenix') throw new Error(`Missing saved timezone for ${city}`);
  }
  const sourceId = (await pool.query("SELECT id FROM sources WHERE slug='arizona-na'")).rows[0].id;
  const sync = await syncSource(pool,sourceId,arizonaNaAdapter);
  const after = (await pool.query('SELECT cache_key,timezone,method,resolved_at FROM timezone_location_cache ORDER BY cache_key')).rows;
  if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error('Repeat import unexpectedly changed the cache');
  console.log(JSON.stringify({persistedEntries:after.length,geographicCallsForSavedCities:geographicCalls,cacheUnchangedAfterFreshProcessImport:true,...sync},null,2));
} finally { await pool.end(); }
}
main().catch(() => { console.error('Timezone cache verification failed.'); process.exitCode = 1; });
