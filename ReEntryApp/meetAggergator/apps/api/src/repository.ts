import { candidateMatches } from './search-diagnostics.js';
import type { Pool, PoolClient } from 'pg';
import type { Meeting, Search } from '@recovery/shared';

const columns = `m.id, m.source_meeting_id AS "sourceMeetingId", m.fellowship, m.name,
 m.day_of_week AS "dayOfWeek", to_char(m.start_time,'HH24:MI') AS "startTime",
 to_char(m.end_time,'HH24:MI') AS "endTime", m.timezone, m.format,
 m.venue_name AS "venueName", m.address, m.city, m.state, m.postal_code AS "postalCode",
 ST_Y(m.geo_point::geometry) AS latitude, ST_X(m.geo_point::geometry) AS longitude,
 m.online_url AS "onlineUrl", m.online_notes AS "onlineNotes", m.characteristics,
 m.source_updated_at AS "sourceUpdatedAt", m.last_synced_at AS "lastSyncedAt",
 s.name AS "sourceName", s.attribution,
 m.raw_source_data->>'timezoneAssumptionNote' AS "timezoneAssumptionNote"`;
export class Repository {
  constructor(public pool: Pool) {}
  async health() { await this.pool.query('SELECT 1 FROM meetings LIMIT 1'); }
  async sources() {
    return (await this.pool.query(`SELECT s.slug,s.name,s.base_url AS "directoryUrl",s.attribution,
      s.last_sync_at AS "lastSyncAt",s.last_sync_status AS "lastSyncStatus",
      count(m.id)::integer AS "meetingCount",array_agg(DISTINCT m.fellowship) FILTER(WHERE m.id IS NOT NULL) AS fellowships
      FROM sources s LEFT JOIN meetings m ON m.source_id=s.id AND m.active
      WHERE s.approved AND s.enabled GROUP BY s.id ORDER BY s.name`)).rows;
  }
  async search(filters: Search, nowWindowMinutes?: number, now = new Date(), unlimited = false) {
    const values: unknown[] = [];
    const param = (value: unknown) => { values.push(value); return `$${values.length}`; };
    const where = ['m.active', 's.enabled', 's.approved'];
    if (filters.city) where.push(`lower(m.city)=lower(${param(filters.city)})`);
    let distance = 'NULL::double precision';
    if (filters.latitude !== undefined && filters.longitude !== undefined) {
      const point = `ST_SetSRID(ST_MakePoint(${param(filters.longitude)},${param(filters.latitude)}),4326)::geography`;
      distance = `ST_Distance(m.geo_point,${point})/1609.344`;
      if (filters.radiusMiles) where.push(`ST_DWithin(m.geo_point,${point},${param(filters.radiusMiles * 1609.344)})`);
    }
    if (filters.fellowship?.length) where.push(`m.fellowship = ANY(${param(filters.fellowship)}::text[])`);
    if (filters.format?.length) where.push(`m.format = ANY(${param(filters.format)}::text[])`);
    if (filters.characteristics?.length) where.push(`m.characteristics @> ${param(filters.characteristics)}::text[]`);
    if (filters.daysOfWeek?.length) where.push(`m.day_of_week = ANY(${param(filters.daysOfWeek)}::integer[])`);
    if (filters.dayOfWeek !== undefined) where.push(`m.day_of_week=${param(filters.dayOfWeek)}`);
    if (filters.timeAfter) where.push(`m.start_time>=${param(filters.timeAfter)}::time`);
    if (filters.timeBefore) where.push(`m.start_time<=${param(filters.timeBefore)}::time`);
    let order = '"distanceMiles" ASC NULLS LAST,m.day_of_week,m.start_time,m.name,m.id';
    let upcoming = '';
    if (nowWindowMinutes !== undefined) {
      const instant = param(filters.asOf ?? now.toISOString());
      // Evaluate each source's local schedule across the next week, including midnight and DST.
      upcoming = ` CROSS JOIN LATERAL (
        SELECT min((((${instant}::timestamptz AT TIME ZONE m.timezone)::date + days.n) + m.start_time) AT TIME ZONE m.timezone) AS starts_at
        FROM generate_series(0,7) days(n)
        WHERE extract(dow FROM (${instant}::timestamptz AT TIME ZONE m.timezone)::date + days.n)=m.day_of_week
        AND ((((${instant}::timestamptz AT TIME ZONE m.timezone)::date + days.n) + m.start_time) AT TIME ZONE m.timezone)>=${instant}::timestamptz
      ) occurrence`;
      where.push(`occurrence.starts_at<=${instant}::timestamptz + ${param(nowWindowMinutes)} * interval '1 minute'`);
      order = `occurrence.starts_at,"distanceMiles" ASC NULLS LAST,m.id`;
    }
    return (await this.pool.query<Meeting>(`SELECT ${columns},${distance} AS "distanceMiles"${upcoming ? ',occurrence.starts_at AS "startsAt"' : ''}
      FROM meetings m JOIN sources s ON s.id=m.source_id ${upcoming}
      WHERE ${where.join(' AND ')} ORDER BY ${order} ${unlimited ? '' : `LIMIT ${param(filters.limit ?? 50)} OFFSET ${param(filters.offset ?? 0)}`}`, values)).rows;
  }
  async searchPage(filters: Search, nowWindowMinutes?: number) {
    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;
    const asOf = filters.asOf ?? new Date().toISOString();
    const rows = await this.search({...filters, limit:limit + 1, asOf}, nowWindowMinutes);
    const meetings = rows.slice(0, limit);
    return {meetings, hasMore:rows.length > limit, nextOffset:offset + meetings.length, asOf};
  }
  async diagnostics(filters: Search, nowWindowMinutes?: number) {
    const matches = await this.search(filters, nowWindowMinutes, new Date(), true);
    const limit = (filters.offset ?? 0) + (filters.limit ?? 50);
    const sources = (await this.pool.query(`SELECT slug,name,last_sync_at AS "lastSyncAt",last_sync_status AS "lastSyncStatus",rejected_meetings AS rejected, ARRAY(SELECT source_meeting_id FROM meetings WHERE source_id=sources.id AND active) AS "retainedIds" FROM sources WHERE approved AND enabled`)).rows;
    const rejected = sources.flatMap(source => (source.rejected ?? []).filter((m: Record<string, unknown>) => candidateMatches(m, filters)).map((m: Record<string, unknown>) => ({...m, sourceName: source.name, priorListingRetained:source.retainedIds.includes(m.sourceMeetingId), reason:'import_validation', certainty:'candidate; invalid or missing fields prevent confirming all criteria', ...(nowWindowMinutes !== undefined ? {timeWindow:'unconfirmed for rejected records'} : {})})));
    const missingCoordinates = filters.radiusMiles ? (await this.search({...filters,latitude:undefined,longitude:undefined,radiusMiles:undefined}, undefined, new Date(), true)).filter(m => m.latitude === null || m.longitude === null).map(m => ({id:m.id,sourceMeetingId:m.sourceMeetingId,name:m.name,city:m.city,sourceName:m.sourceName,reason:'missing_coordinates',certainty:'distance and upcoming window unconfirmed'})) : [];
    return {matchedCount:matches.length, displayedCount:Math.min(limit,matches.length), omittedByLimit:matches.slice(limit).map(m => ({id:m.id,sourceMeetingId:m.sourceMeetingId,name:m.name,city:m.city,sourceName:m.sourceName,reason:'result_limit'})), rejectedCandidates:rejected, missingCoordinates, sources:sources.map(({rejected,retainedIds,...source}) => ({...source,rejectionSnapshotAvailable:rejected !== null})), coverageNote:'Diagnostics cover stored listings and validation rejections from the latest instrumented sync. Adapter-level exclusions and sources not connected are not enumerated. Candidates with missing fields may not satisfy every criterion.'};
  }
  async detail(id: string) {
    return (await this.pool.query<Meeting>(`SELECT ${columns},NULL::double precision AS "distanceMiles"
      FROM meetings m JOIN sources s ON s.id=m.source_id
      WHERE m.id=$1 AND m.active AND s.enabled AND s.approved`, [id])).rows[0];
  }
  async report(id: string, reason: string, note?: string) {
    return (await this.pool.query(`INSERT INTO meeting_reports(meeting_id,reason,note)
      SELECT m.id,$2,$3 FROM meetings m JOIN sources s ON s.id=m.source_id
      WHERE m.id=$1 AND m.active AND s.enabled AND s.approved RETURNING id`, [id, reason, note ?? null])).rows[0];
  }
  async reports() {
    return (await this.pool.query('SELECT id,meeting_id,reason,note,status,created_at FROM meeting_reports ORDER BY created_at DESC LIMIT 100')).rows;
  }
}



