import { z, type MeetingSourceAdapter } from '@recovery/shared';

export const phoenixAaFeed = 'https://aaphoenix.org/wp-admin/admin-ajax.php?action=meetings';
const payload = z.array(z.record(z.string(), z.unknown()));
const text = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : null;
const number = (value: unknown) => value === null || value === undefined || value === '' ? null : Number(value);
const tags: Record<string,string> = {O:'open',C:'closed',D:'discussion',B:'beginner',BE:'beginner',W:'women',M:'men',LGBTQ:'lgbtq',S:'speaker',ST:'step',BB:'book_study',MED:'meditation',SP:'spanish',X:'wheelchair_accessible',Y:'young_people'};

export function normalizeTsml(data: unknown, fellowship: string, typeMap: Record<string,string> = tags): unknown[] {
  return payload.parse(data).flatMap(m => {
    const types = Array.isArray(m.types) ? m.types.map(String) : [];
    // Closed listings and non-Arizona addresses are not usable in this Arizona MVP.
    if (types.includes('TC')) return [];
    const formatted = text(m.formatted_address);
    const parts = formatted?.split(',').map(p => p.trim()) ?? [];
    const stateIndex = parts.findIndex(p => /^AZ(?:\s+\d{5}(?:-\d{4})?)?$/.test(p));
    if (stateIndex < 1) return [];
    const city = parts[stateIndex-1];
    const approximate = m.approximate === 'yes' || m.approximate === true;
    const statePart = parts[stateIndex];
    const updated = text(m.updated);
    const timestamp = updated && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(updated)
      ? new Date(updated.replace(' ','T')+'Z') : null;
    const id = m.id === undefined || m.id === null ? text(m.slug) : String(m.id);
    const days = Array.isArray(m.day) ? m.day : [m.day];
    return days.map(day => ({
      sourceMeetingId: id ? `${id}:${day}` : null,
      name: text(m.name), fellowship, dayOfWeek: day, startTime:text(m.time),
      endTime:text(m.end_time), timezone:text(m.timezone),
      format: m.attendance_option, venueName:text(m.location),
      address: approximate ? null : parts.slice(0,stateIndex-1).join(', ') || null,
      city, state:'AZ', postalCode:statePart.match(/\d{5}(?:-\d{4})?/)?.[0] ?? null,
      // Do not present approximate online locations as precise physical meeting points.
      latitude:approximate ? null : number(m.latitude), longitude:approximate ? null : number(m.longitude),
      onlineUrl:text(m.conference_url), onlineNotes:text(m.conference_url_notes),
      characteristics:[...new Set(types.map(type => typeMap[type]).filter(Boolean))],
      sourceUpdatedAt:timestamp && !Number.isNaN(timestamp.getTime()) ? timestamp.toISOString() : null,
      rawSourceData: {id:m.id,slug:m.slug,day:m.day,time:m.time,timezone:m.timezone,types:m.types,attendance_option:m.attendance_option,approximate:m.approximate,updated:m.updated}
    }));
  });
}
export const normalizePhoenixAa = (data: unknown) => normalizeTsml(data,'AA');
export const phoenixAaAdapter: MeetingSourceAdapter = {
  async fetch() {
    const response = await fetch(phoenixAaFeed,{signal:AbortSignal.timeout(30_000)});
    if (!response.ok) throw new Error(`Phoenix AA feed returned HTTP ${response.status}`);
    return response.json();
  },
  async normalize(data) {return normalizePhoenixAa(data);}
};
