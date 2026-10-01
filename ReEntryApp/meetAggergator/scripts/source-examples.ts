import { Pool } from 'pg';
import { writeFile } from 'node:fs/promises';
import { sourceRegistry } from '../apps/api/src/sources/registry.js';
import { meetingInputSchema } from '@recovery/shared';
import { fillMissingTimezone } from '../apps/api/src/timezone.js';
async function main() {
const pool = new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:1500});
let report = '# Live source JSON and stored rows\n\nCaptured '+new Date().toISOString()+'. Read-only inspection. Source examples are selected field excerpts, not entire payloads.\n';
try {
  for (const [slug,source] of Object.entries(sourceRegistry)) {
    console.log(`Inspecting ${slug}`);
    const feed = await source.adapter.fetch();
    const normalized = (await source.adapter.normalize(feed)).map(fillMissingTimezone).map(m=>meetingInputSchema.safeParse(m)).find(m=>m.success)?.data;
    if (!normalized) throw new Error(`No stored example for ${slug}`);
    let row;
    try { row = (await pool.query(`SELECT m.id,s.slug AS source_slug,m.source_meeting_id,m.fellowship,m.name,m.day_of_week,
      to_char(m.start_time,'HH24:MI') AS start_time,m.timezone,m.format,m.venue_name,m.address,m.city,m.state,
      ST_AsText(m.geo_point::geometry) AS geo_point,m.characteristics,m.last_synced_at,m.raw_source_data
      FROM meetings m JOIN sources s ON s.id=m.source_id WHERE s.slug=$1 AND m.active AND m.source_meeting_id=$2 LIMIT 1`,[slug,normalized.sourceMeetingId])).rows[0]; } catch { /* Database may be unavailable; label mapped example explicitly. */ }
    const stored = Boolean(row);
    row ??= {source_slug:slug,source_meeting_id:normalized.sourceMeetingId,fellowship:normalized.fellowship,name:normalized.name,
      day_of_week:normalized.dayOfWeek,start_time:normalized.startTime,timezone:normalized.timezone,format:normalized.format,
      venue_name:normalized.venueName,address:normalized.address,city:normalized.city,state:normalized.state,
      geo_point:normalized.longitude===null ? null : `POINT(${normalized.longitude} ${normalized.latitude})`,characteristics:normalized.characteristics,raw_source_data:normalized.rawSourceData};
    const records = Array.isArray(feed) ? feed : (feed as {meetings:Record<string,unknown>[]}).meetings;
    const record = records.find((m:Record<string,unknown>) => slug==='arizona-na'
      ? String(m.id_bigint)===row.source_meeting_id
      : `${m.id}:${Array.isArray(m.day) ? row.day_of_week : m.day}`===row.source_meeting_id);
    if (!record) throw new Error(`Stored example no longer appears in feed for ${slug}`);
    const keys = slug==='arizona-na'
      ? ['id_bigint','meeting_name','weekday_tinyint','start_time','time_zone','venue_type','location_text','location_street','location_municipality','location_province','formats']
      : ['id','name','day','time','end_time','timezone','attendance_option','location','formatted_address','types'];
    const excerpt = Object.fromEntries(keys.filter(key=>Object.hasOwn(record,key)).map(key=>[key,record[key]]));
    report += `\n## ${source.name}\n\nOfficial directory: ${source.url}\n\nSource JSON excerpt:\n\n\`\`\`json\n${JSON.stringify(excerpt,null,2)}\n\`\`\`\n\n${stored ? 'Actual meetings row' : 'Mapped database fields from current adapter; live database read unavailable'}:\n\n\`\`\`json\n${JSON.stringify(row,null,2)}\n\`\`\`\n`;
  }
  await writeFile('docs/source-json-examples.md',report);
  console.log(report);
} finally { await pool.end(); }
}
main().catch(error=>{console.error(error instanceof Error && /^(No stored example|Stored example)/.test(error.message) ? error.message : 'Source example inspection failed.');process.exitCode=1;});
