import type { Search } from '@recovery/shared';

// Missing fields remain candidates: they cannot prove that a requested filter fails.
export function candidateMatches(m: Record<string, unknown>, f: Search) {
  if (f.city && typeof m.city === 'string' && m.city.trim().toLowerCase() !== f.city.toLowerCase()) return false;
  for (const key of ['fellowship', 'format'] as const) {
    if (f[key]?.length && typeof m[key] === 'string' && !f[key]!.includes(m[key] as never)) return false;
  }
  if (f.daysOfWeek?.length && typeof m.dayOfWeek === 'number' && !f.daysOfWeek.includes(m.dayOfWeek)) return false;
  if (f.dayOfWeek !== undefined && typeof m.dayOfWeek === 'number' && f.dayOfWeek !== m.dayOfWeek) return false;
  if (typeof m.startTime === 'string' && /^\d{2}:\d{2}$/.test(m.startTime)) {
    if (f.timeAfter && m.startTime < f.timeAfter) return false;
    if (f.timeBefore && m.startTime > f.timeBefore) return false;
  }
  if (f.characteristics?.length && Array.isArray(m.characteristics) && !f.characteristics.every(tag => (m.characteristics as unknown[]).includes(tag))) return false;
  if (f.radiusMiles && typeof m.latitude === 'number' && typeof m.longitude === 'number') {
    const radians = (n: number) => n * Math.PI / 180;
    const a = Math.sin(radians(m.latitude - f.latitude!) / 2) ** 2 + Math.cos(radians(f.latitude!)) * Math.cos(radians(m.latitude)) * Math.sin(radians(m.longitude - f.longitude!) / 2) ** 2;
    if (3958.7613 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1-a))) > f.radiusMiles * 1.01) return false;
  }
  return true;
}
