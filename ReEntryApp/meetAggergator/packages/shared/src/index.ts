import { z } from 'zod';
export { z };

export const formats = ['in_person', 'online', 'hybrid'] as const;
export const reportReasons = ['meeting_closed', 'wrong_day', 'wrong_time', 'wrong_address', 'broken_online_link', 'wrong_type', 'other'] as const;
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const nullableText = z.string().trim().min(1).nullable().default(null);
export const meetingInputSchema = z.object({
  sourceMeetingId: z.string().trim().min(1).max(200),
  fellowship: z.string().trim().min(1).max(80), name: z.string().trim().min(1).max(300),
  dayOfWeek: z.number().int().min(0).max(6), startTime: time,
  endTime: time.nullable().default(null),
  timezone: z.string().refine(value => { try { new Intl.DateTimeFormat('en', { timeZone: value }); return true; } catch { return false; } }, 'Invalid IANA timezone'),
  format: z.enum(formats), venueName: nullableText, address: nullableText,
  city: nullableText, state: z.string().length(2), postalCode: nullableText,
  latitude: z.number().min(-90).max(90).nullable().default(null),
  longitude: z.number().min(-180).max(180).nullable().default(null),
  onlineUrl: z.url().refine(v => /^https?:\/\//.test(v)).nullable().default(null), onlineNotes: nullableText,
  characteristics: z.array(z.string().min(1).max(80)).max(30).default([]),
  sourceUpdatedAt: z.iso.datetime().nullable().default(null),
  rawSourceData: z.unknown().optional()
}).refine(m => (m.latitude === null) === (m.longitude === null), 'Coordinates must be supplied together');
export type MeetingInput = z.infer<typeof meetingInputSchema>;
export type Meeting = MeetingInput & { id: string; sourceName: string; attribution: string | null; lastSyncedAt: string; distanceMiles: number | null; timezoneAssumptionNote?: string | null };
const optionalNumber = (schema: z.ZodNumber) => z.preprocess(v => v === '' || v === undefined ? undefined : Number(v), schema.optional());
const list = z.preprocess(v => typeof v === 'string' ? v.split(',').filter(Boolean) : v, z.array(z.string().min(1).max(80)).max(30).optional());
export const searchSchema = z.object({
  city: z.string().trim().min(1).max(120).optional(),
  latitude: optionalNumber(z.number().min(-90).max(90)), longitude: optionalNumber(z.number().min(-180).max(180)),
  radiusMiles: optionalNumber(z.number().positive().max(100)),
  fellowship: list, format: z.preprocess(v => typeof v === 'string' ? v.split(',') : v, z.array(z.enum(formats)).optional()),
  characteristics: list, dayOfWeek: optionalNumber(z.number().int().min(0).max(6)),
  daysOfWeek: z.preprocess(v => typeof v === 'string' ? v.split(',').map(value => value.trim() === '' ? NaN : Number(value)) : v, z.array(z.number().int().min(0).max(6)).min(1).max(7).optional()),
  timeAfter: time.optional(), timeBefore: time.optional(),
  limit: optionalNumber(z.number().int().positive().max(100)),
  offset: optionalNumber(z.number().int().nonnegative().max(1000000)),
  asOf: z.iso.datetime().optional()
}).refine(s => (s.latitude === undefined) === (s.longitude === undefined), 'Both coordinates are required')
  .refine(s => s.radiusMiles === undefined || s.latitude !== undefined, 'Radius requires coordinates')
  .refine(s => !s.timeAfter || !s.timeBefore || s.timeAfter <= s.timeBefore, 'Time range must be within a single day');
export type Search = z.infer<typeof searchSchema>;
export const reportSchema = z.object({reason: z.enum(reportReasons), note: z.string().trim().max(2000).optional()});
export interface MeetingSourceAdapter { fetch(): Promise<unknown>; normalize(data: unknown): Promise<unknown[]>; }
