import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../apps/api/src/app.js';
import type { Repository } from '../apps/api/src/repository.js';

const id = 'cb398b79-2459-41c3-b2ab-b60798d36c15';
const repository = () => ({ search: vi.fn().mockResolvedValue([]), health: vi.fn().mockResolvedValue(undefined), searchPage: vi.fn().mockResolvedValue({meetings:[],hasMore:false,nextOffset:0,asOf:'2026-09-30T16:00:00Z'}), detail: vi.fn().mockResolvedValue(undefined), report: vi.fn().mockResolvedValue({id}), reports: vi.fn().mockResolvedValue([]) });
const apps: ReturnType<typeof buildApp>[] = [];
afterEach(async () => { await Promise.all(apps.splice(0).map(app => app.close())); });
function setup() {
  const repo = repository();
  const app = buildApp(repo as unknown as Repository, 'test-only-token');
  apps.push(app);
  return { app, repo };
}
describe('meeting API', () => {
  it('maps every filtered match independent of list pagination and excludes online/missing coordinates', async () => {
    const {app,repo} = setup();
    repo.search.mockResolvedValue(Array.from({length:75},(_,i) => ({id:String(i),format:i === 0 ? 'online' : 'in_person',latitude:i === 1 ? null : 33,longitude:-112})));
    const response = await app.inject('/api/v1/meetings/map?city=Mesa&fellowship=AA,NA&daysOfWeek=1,3&limit=50&offset=50&mode=now&asOf=2026-09-30T16:00:00Z');
    expect(response.statusCode).toBe(200);
    expect(response.json().meetings).toHaveLength(73);
    expect(response.json().matchedCount).toBe(75);
    expect(response.json().unmappedCount).toBe(2);
    expect(repo.search).toHaveBeenCalledWith(expect.objectContaining({city:'Mesa',fellowship:['AA','NA'],daysOfWeek:[1,3],asOf:'2026-09-30T16:00:00Z'}),120,expect.any(Date),true);
    repo.search.mockClear();
    expect((await app.inject('/api/v1/meetings/map?latitude=33')).statusCode).toBe(400);
    expect(repo.search).not.toHaveBeenCalled();
  });
  it('validates pagination and returns page metadata', async () => {
    const {app,repo} = setup();
    const response = await app.inject('/api/v1/meetings?city=Mesa&limit=50&offset=100&asOf=2026-09-30T16:00:00Z');
    expect(response.statusCode).toBe(200);
    expect(repo.searchPage).toHaveBeenCalledWith({city:'Mesa',limit:50,offset:100,asOf:'2026-09-30T16:00:00Z'});
    expect(response.json().hasMore).toBe(false);
    repo.searchPage.mockClear();
    for (const offset of ['-1','1.5','abc']) expect((await app.inject(`/api/v1/meetings?offset=${offset}`)).statusCode).toBe(400);
    expect(repo.searchPage).not.toHaveBeenCalled();
  });
  it('allows the configured preview origin and rejects unrelated origins', async () => {
    const { app } = setup();
    const allowed = (process.env.CLIENT_ORIGIN ?? 'http://localhost:8081').split(',')[0].trim();
    const response = await app.inject({method:'OPTIONS',url:'/health',headers:{origin:allowed,'access-control-request-method':'GET'}});
    expect(response.headers['access-control-allow-origin']).toBe(allowed);
    const unrelated = await app.inject({method:'OPTIONS',url:'/health',headers:{origin:'https://unrelated.example','access-control-request-method':'GET'}});
    expect(unrelated.headers['access-control-allow-origin']).toBeUndefined();
  });
  it('reports database unavailability without exposing internal errors', async () => {
    const { app, repo } = setup();
    repo.health.mockRejectedValue(new Error('private connection details'));
    const response = await app.inject('/health');
    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({status:'unavailable', database:'disconnected'});
  });
  it('rejects incomplete coordinates before querying the database', async () => {
    const { app, repo } = setup();
    expect((await app.inject('/api/v1/meetings?latitude=33')).statusCode).toBe(400);
    expect(repo.searchPage).not.toHaveBeenCalled();
  });
  it('passes validated search filters and the upcoming window to the repository', async () => {
    const { app, repo } = setup();
    expect((await app.inject('/api/v1/meetings/now?city=Mesa&fellowship=AA,NA')).statusCode).toBe(200);
    expect(repo.searchPage).toHaveBeenCalledWith({city:'Mesa', fellowship:['AA','NA']},120);
  });
  it('accepts multiple programs, formats and days and rejects invalid days', async () => {
    const { app, repo } = setup();
    expect((await app.inject('/api/v1/meetings?fellowship=AA,NA&format=in_person,online&daysOfWeek=1,3&characteristics=women,beginner')).statusCode).toBe(200);
    expect(repo.searchPage).toHaveBeenCalledWith({fellowship:['AA','NA'],format:['in_person','online'],daysOfWeek:[1,3],characteristics:['women','beginner']});
    repo.searchPage.mockClear();
    for (const days of ['7','-1','Monday','1,']) expect((await app.inject(`/api/v1/meetings?daysOfWeek=${days}`)).statusCode).toBe(400);
    expect(repo.searchPage).not.toHaveBeenCalled();
  });
  it('returns 400 for malformed IDs and 404 for unavailable meetings', async () => {
    const { app } = setup();
    expect((await app.inject('/api/v1/meetings/invalid')).statusCode).toBe(400);
    expect((await app.inject(`/api/v1/meetings/${id}`)).statusCode).toBe(404);
  });
  it('validates correction reasons and accepts a valid report', async () => {
    const { app, repo } = setup();
    expect((await app.inject({method:'POST',url:`/api/v1/meetings/${id}/report`,payload:{reason:'unknown'}})).statusCode).toBe(400);
    expect(repo.report).not.toHaveBeenCalled();
    expect((await app.inject({method:'POST',url:`/api/v1/meetings/${id}/report`,payload:{reason:'wrong_time',note:'  Please check  '}})).statusCode).toBe(201);
    expect(repo.report).toHaveBeenCalledWith(id,'wrong_time','Please check');
  });
  it('protects internal reports with the configured bearer token', async () => {
    const { app, repo } = setup();
    expect((await app.inject('/api/v1/internal/reports')).statusCode).toBe(401);
    expect(repo.reports).not.toHaveBeenCalled();
    expect((await app.inject({url:'/api/v1/internal/reports',headers:{authorization:'Bearer test-only-token'}})).statusCode).toBe(200);
  });
});



