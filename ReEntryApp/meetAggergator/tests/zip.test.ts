import { afterEach, expect, it, vi } from 'vitest';
import { buildApp } from '../apps/api/src/app.js';
import type { Repository } from '../apps/api/src/repository.js';
const app = buildApp({} as Repository);
afterEach(() => vi.unstubAllGlobals());
const payload = (city = 'Tempe', state = 'AZ') => ({places:[{'place name':city,'state abbreviation':state}]});
it('resolves ZIP and ZIP+4 to an Arizona city without needing a database', async () => {
  const fetcher = vi.fn().mockImplementation(async () => new Response(JSON.stringify(payload())));
  vi.stubGlobal('fetch',fetcher);
  for (const zip of ['85281','85281-1234']) {
    const response = await app.inject(`/api/v1/locations/zip/${zip}`);
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({zip:'85281',city:'Tempe',state:'AZ'});
  }
  expect(fetcher.mock.calls.every(call => call[0] === 'https://api.zippopotam.us/us/85281')).toBe(true);
});
it('rejects malformed ZIP codes without contacting the provider', async () => {
  const fetcher = vi.fn(); vi.stubGlobal('fetch',fetcher);
  expect((await app.inject('/api/v1/locations/zip/8528')).statusCode).toBe(400);
  expect(fetcher).not.toHaveBeenCalled();
});
it('explains unknown ZIP codes and out-of-state coverage', async () => {
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('{}',{status:404})));
  expect((await app.inject('/api/v1/locations/zip/00000')).statusCode).toBe(404);
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify(payload('Beverly Hills','CA')))));
  expect((await app.inject('/api/v1/locations/zip/90210')).statusCode).toBe(400);
});
it('handles provider failures and malformed responses without leaking details', async () => {
  for (const response of [new Response('{}',{status:500}),new Response('{}')]) {
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue(response));
    const result = await app.inject('/api/v1/locations/zip/85281');
    expect(result.statusCode).toBe(503);
    expect(result.json().error).toContain('enter a city name');
  }
  vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('private diagnostic')));
  expect((await app.inject('/api/v1/locations/zip/85281')).statusCode).toBe(503);
});

