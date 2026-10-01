import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { Repository } from '../apps/api/src/repository.js';
import { syncSource } from '../apps/api/src/sync.js';
import { fixtureMeeting } from './fixtures.js';
// Requires a dedicated migrated test database. Creates and removes only its own source rows.
describe.skipIf(!process.env.TEST_DATABASE_URL)('Real PostGIS integration', () => {
  const pool=new Pool({connectionString:process.env.TEST_DATABASE_URL});const repo=new Repository(pool);let sourceId:string;
  const adapter=(data:unknown[]) => ({fetch:async()=>data,normalize:async(raw:unknown)=>raw as unknown[]});
  beforeAll(async () => {sourceId=(await pool.query("INSERT INTO sources(name,slug,enabled,approved) VALUES('Fictional integration fixture',$1,true,true) RETURNING id",[`test-${crypto.randomUUID()}`])).rows[0].id;});
  afterAll(async () => {if(sourceId){await pool.query('DELETE FROM meeting_reports WHERE meeting_id IN (SELECT id FROM meetings WHERE source_id=$1)',[sourceId]);await pool.query('DELETE FROM meetings WHERE source_id=$1',[sourceId]);await pool.query('DELETE FROM sources WHERE id=$1',[sourceId]);}await pool.end();});
  it('upserts with stable identity and preserves data after failed or partial imports', async () => {
    await syncSource(pool,sourceId,adapter([fixtureMeeting]));
    const initial=(await pool.query('SELECT id FROM meetings WHERE source_id=$1',[sourceId])).rows[0].id;
    await syncSource(pool,sourceId,adapter([{...fixtureMeeting,name:'Updated fictional test meeting'}]));
    expect((await pool.query('SELECT id FROM meetings WHERE source_id=$1',[sourceId])).rows).toEqual([{id:initial}]);
    await expect(syncSource(pool,sourceId,{fetch:async()=>{throw new Error('Network failure');},normalize:async()=>[]})).rejects.toThrow();
    await expect(syncSource(pool,sourceId,adapter([]))).rejects.toThrow();
    const partial=await syncSource(pool,sourceId,adapter([fixtureMeeting,{...fixtureMeeting,sourceMeetingId:'bad',timezone:'invalid'}]));
    expect(partial).toEqual({imported:1,skipped:1});expect(await repo.detail(initial)).toBeTruthy();
  });
  it('uses PostGIS radius and AND tags; rejects records outside the radius', async () => {
    const rows=await repo.search({latitude:33.4484,longitude:-112.074,radiusMiles:1,fellowship:['NA'],characteristics:['women','beginner']});
    expect(rows.some(m=>m.sourceMeetingId==='fictional-001')).toBe(true);
    const far=await repo.search({latitude:32.2226,longitude:-110.9747,radiusMiles:1});expect(far.some(m=>m.sourceMeetingId==='fictional-001')).toBe(false);
    expect((await repo.search({characteristics:['unsupported-tag']})).length).toBe(0);
  });
  it('matches any selected program, format and day while requiring all characteristics', async () => {
    await syncSource(pool,sourceId,adapter([fixtureMeeting,{...fixtureMeeting,sourceMeetingId:'other-day',fellowship:'AA',format:'online',dayOfWeek:4}]));
    const filters={fellowship:['AA','NA'],format:['in_person','online'] as const,daysOfWeek:[2,4],characteristics:['women','beginner']};
    const rows=await repo.search({...filters,format:[...filters.format]});
    expect(rows.filter(m=>['fictional-001','other-day'].includes(m.sourceMeetingId)).map(m=>m.sourceMeetingId).sort()).toEqual(['fictional-001','other-day']);
    expect((await repo.search({daysOfWeek:[1,3]})).some(m=>['fictional-001','other-day'].includes(m.sourceMeetingId))).toBe(false);
  });
  it('handles a Phoenix meeting across midnight and orders upcoming starts', async () => {
    await syncSource(pool,sourceId,adapter([{...fixtureMeeting,sourceMeetingId:'midnight',dayOfWeek:3,startTime:'00:30'}]));
    const meetings=await repo.search({fellowship:['NA']},120,new Date('2026-09-30T06:30:00Z'));
    expect(meetings.some(m=>m.sourceMeetingId==='midnight')).toBe(true);
    expect(meetings.some(m=>m.sourceMeetingId==='fictional-001')).toBe(false);
  });
  it('reports matching limit omissions and field-specific import rejections', async () => {
    await syncSource(pool,sourceId,adapter([fixtureMeeting,{...fixtureMeeting,sourceMeetingId:'missing-zone',timezone:null,city:'Unknown fictional location',latitude:null,longitude:null}]));
    const diagnostics = await repo.diagnostics({limit:1});
    expect(diagnostics.matchedCount).toBeGreaterThan(1);
    expect(diagnostics.omittedByLimit.length).toBe(diagnostics.matchedCount-1);
    expect(diagnostics.rejectedCandidates).toEqual(expect.arrayContaining([expect.objectContaining({sourceMeetingId:'missing-zone',priorListingRetained:false,reasons:expect.arrayContaining([expect.stringContaining('timezone')])})]));
  });
  it('repairs missing timezones for any source before validation and stores provenance', async () => {
    const result = await syncSource(pool,sourceId,adapter([{...fixtureMeeting,sourceMeetingId:'shared-timezone',fellowship:'AA',timezone:null,rawSourceData:{timezone:''}}]));
    expect(result).toEqual({imported:1,skipped:0});
    const row = (await pool.query('SELECT timezone,raw_source_data FROM meetings WHERE source_id=$1 AND source_meeting_id=$2',[sourceId,'shared-timezone'])).rows[0];
    expect(row).toMatchObject({timezone:'America/Phoenix',raw_source_data:{timezone:'',timezoneResolution:{method:'city_state_dataset'}}});
    expect((await pool.query("SELECT timezone FROM timezone_location_cache WHERE cache_key='US|AZ|phoenix'")).rows[0].timezone).toBe('America/Phoenix');
  });
  it('loads every matching listing in stable pages and stops on the final page', async () => {
    const city = 'Pagination fixture';
    await syncSource(pool,sourceId,adapter(Array.from({length:121},(_,i) => ({...fixtureMeeting,city,sourceMeetingId:`page-${i}`,name:`Page ${String(i).padStart(3,'0')}`}))));
    const first = await repo.searchPage({city,limit:50});
    const second = await repo.searchPage({city,limit:50,offset:first.nextOffset,asOf:first.asOf});
    const last = await repo.searchPage({city,limit:50,offset:second.nextOffset,asOf:first.asOf});
    expect([first.meetings.length,second.meetings.length,last.meetings.length]).toEqual([50,50,21]);
    expect([first.hasMore,second.hasMore,last.hasMore]).toEqual([true,true,false]);
    expect(new Set([...first.meetings,...second.meetings,...last.meetings].map(m=>m.id)).size).toBe(121);
    const now = await repo.searchPage({city,asOf:'2026-09-30T06:30:00Z'},120);
    const nowNext = await repo.searchPage({city,asOf:now.asOf,offset:now.nextOffset},120);
    expect(nowNext.asOf).toBe(now.asOf);
  });
});


