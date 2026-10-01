import { meetingInputSchema, type MeetingSourceAdapter } from '@recovery/shared';
import type { Pool } from 'pg';
import { createTimezoneResolver, type CachedTimezone } from './timezone.js';

export async function syncSource(pool: Pool, sourceId: string, adapter: MeetingSourceAdapter) {
  const source = (await pool.query('SELECT approved,enabled FROM sources WHERE id=$1', [sourceId])).rows[0];
  if (!source?.approved || !source.enabled) throw new Error('Source must be approved and enabled');
  try {
    const raw = await adapter.fetch();
    const cachedRows = (await pool.query('SELECT cache_key,timezone,method FROM timezone_location_cache')).rows;
    const cache = new Map<string,CachedTimezone>(cachedRows.map(row => [row.cache_key,{timezone:row.timezone,method:row.method}]));
    const previousKeys = new Set(cache.keys());
    const normalized = (await adapter.normalize(raw)).map(createTimezoneResolver(cache));
    for (const [key, resolution] of cache) {
      if (!previousKeys.has(key)) await pool.query('INSERT INTO timezone_location_cache(cache_key,timezone,method) VALUES($1,$2,$3) ON CONFLICT(cache_key) DO NOTHING',[key,resolution.timezone,resolution.method]);
    }
    const records = normalized.map(record => meetingInputSchema.safeParse(record));
    const valid = records.filter(record => record.success).map(record => record.data!);
    const rejected = records.flatMap((result, index) => {
      if (result.success) return [];
      const record = normalized[index] as Record<string, unknown>;
      return [{...Object.fromEntries(['sourceMeetingId','name','city','state','fellowship','format','dayOfWeek','startTime','timezone','latitude','longitude','characteristics'].map(key => [key, record[key]])), reasons: result.error.issues.map(issue => `${issue.path.join('.') || 'record'}: ${issue.message}`)}];
    });
    await pool.query('UPDATE sources SET rejected_meetings=$2 WHERE id=$1', [sourceId, JSON.stringify(rejected)]);
    const ids = valid.map(record => record.sourceMeetingId);
    if (new Set(ids).size !== ids.length) throw new Error('Duplicate source identifiers');
    if (valid.length === 0) throw new Error('Source returned no valid records; prior data preserved');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT id FROM sources WHERE id=$1 FOR UPDATE', [sourceId]);
      for (const m of valid) {
        await client.query(`INSERT INTO meetings(source_id,source_meeting_id,fellowship,name,day_of_week,start_time,end_time,timezone,
          format,venue_name,address,city,state,postal_code,geo_point,online_url,online_notes,characteristics,source_updated_at,raw_source_data)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,
          CASE WHEN $15::double precision IS NULL THEN NULL ELSE ST_SetSRID(ST_MakePoint($16,$15),4326)::geography END,$17,$18,$19,$20,$21)
          ON CONFLICT(source_id,source_meeting_id) DO UPDATE SET fellowship=EXCLUDED.fellowship,name=EXCLUDED.name,
          day_of_week=EXCLUDED.day_of_week,start_time=EXCLUDED.start_time,end_time=EXCLUDED.end_time,timezone=EXCLUDED.timezone,
          format=EXCLUDED.format,venue_name=EXCLUDED.venue_name,address=EXCLUDED.address,city=EXCLUDED.city,state=EXCLUDED.state,
          postal_code=EXCLUDED.postal_code,geo_point=EXCLUDED.geo_point,online_url=EXCLUDED.online_url,online_notes=EXCLUDED.online_notes,
          characteristics=EXCLUDED.characteristics,source_updated_at=EXCLUDED.source_updated_at,raw_source_data=EXCLUDED.raw_source_data,
          last_synced_at=now(),updated_at=now(),active=true`,
          [sourceId,m.sourceMeetingId,m.fellowship,m.name,m.dayOfWeek,m.startTime,m.endTime,m.timezone,m.format,m.venueName,
            m.address,m.city,m.state,m.postalCode,m.latitude,m.longitude,m.onlineUrl,m.onlineNotes,m.characteristics,
            m.sourceUpdatedAt,JSON.stringify(m.rawSourceData ?? null)]);
      }
      // Partial/bad feeds never deactivate previous meetings. Removal requires a separately approved policy.
      await client.query("UPDATE sources SET last_sync_at=now(),last_sync_status=$2 WHERE id=$1", [sourceId,valid.length === records.length ? 'success' : 'partial']);
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
    return { imported: valid.length, skipped: records.length - valid.length };
  } catch (error) {
    await pool.query("UPDATE sources SET last_sync_status='failed' WHERE id=$1", [sourceId]);
    throw error;
  }
}

