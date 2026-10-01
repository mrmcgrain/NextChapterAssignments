import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { timingSafeEqual } from 'node:crypto';
import { z, reportSchema, searchSchema } from '@recovery/shared';
import type { Repository } from './repository.js';
import { resolveZip } from './zip.js';

export function buildApp(repository: Repository, token = process.env.INTERNAL_API_TOKEN) {
  // Request logging is off: URLs may contain exact coordinates and reports contain private text.
  const app = Fastify({ logger: false, bodyLimit: 16_384 });
  app.register(cors, { origin: (process.env.CLIENT_ORIGIN ?? 'http://localhost:8081,http://127.0.0.1:8081').split(',').map(origin => origin.trim()).filter(Boolean) });
  app.register(rateLimit, { max: 120, timeWindow: '1 minute' });
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof z.ZodError) return reply.code(400).send({error: 'Invalid request', details: error.issues.map(i => i.message)});
    const status = error instanceof Error && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : 503;
    return reply.code(status).send({error: status >= 500 ? 'Service temporarily unavailable. Please try again.' : 'Request could not be processed.'});
  });
  app.get('/health', async (_request, reply) => {
    try { await repository.health(); return {status: 'ok', database: 'connected'}; }
    catch { return reply.code(503).send({status: 'unavailable', database: 'disconnected'}); }
  });
  app.get('/api/v1/locations/zip/:zip', async (request, reply) => {
    const zip = z.string().regex(/^\d{5}(?:-\d{4})?$/, 'Enter a five-digit ZIP code.').parse((request.params as {zip:string}).zip);
    let location;
    try { location = await resolveZip(zip); }
    catch { return reply.code(503).send({error:'ZIP lookup is unavailable. Try again or enter a city name.'}); }
    if (!location) return reply.code(404).send({error:'ZIP code not found. Check it or enter a city name.'});
    if (location.state !== 'AZ') return reply.code(400).send({error:'Meeting coverage is currently limited to Arizona. Enter an Arizona ZIP code or city.'});
    return location;
  });
  app.get('/api/v1/meetings', async request => repository.searchPage(searchSchema.parse(request.query)));
  app.get('/api/v1/meetings/map', async request => {
    const query = request.query as Record<string, unknown>;
    const filters = searchSchema.parse(query);
    const asOf = filters.asOf ?? new Date().toISOString();
    const matches = await repository.search({...filters, asOf}, query.mode === 'now' ? 120 : undefined, new Date(), true);
    const meetings = matches.filter(m => m.format !== 'online' && m.latitude !== null && m.longitude !== null);
    return {meetings, matchedCount:matches.length, unmappedCount:matches.length - meetings.length, asOf};
  });
  app.get('/api/v1/meetings/diagnostics', async request => {
    const query = request.query as Record<string, unknown>;
    return repository.diagnostics(searchSchema.parse(query), query.mode === 'now' ? 120 : undefined);
  });
  app.get('/api/v1/sources', async () => ({sources: await repository.sources()}));
  app.get('/api/v1/meetings/now', async request => repository.searchPage(searchSchema.parse(request.query), 120));
  app.get('/api/v1/meetings/:id', async (request, reply) => {
    const id = z.uuid().parse((request.params as {id: string}).id);
    const meeting = await repository.detail(id);
    return meeting ?? reply.code(404).send({error: 'Meeting not found'});
  });
  app.post('/api/v1/meetings/:id/report', {config: {rateLimit: {max: 5, timeWindow: '1 minute'}}}, async (request, reply) => {
    const id = z.uuid().parse((request.params as {id: string}).id);
    const {reason, note} = reportSchema.parse(request.body);
    const report = await repository.report(id, reason, note);
    return report ? reply.code(201).send({id: report.id}) : reply.code(404).send({error: 'Meeting not found'});
  });
  app.get('/api/v1/internal/reports', async (request, reply) => {
    const supplied = request.headers.authorization;
    const expected = `Bearer ${token}`;
    if (!token || !supplied || Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected)))
      return reply.code(401).send({error: 'Unauthorized'});
    return {reports: await repository.reports()};
  });
  return app;
}

