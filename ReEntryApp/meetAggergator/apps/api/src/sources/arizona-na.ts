import { z, type MeetingSourceAdapter } from '@recovery/shared';

export const arizonaNaFeed = 'https://bmlt.wszf.org/main_server/client_interface/json/?switcher=GetSearchResults&get_used_formats=1&services[]=1190&recursive=1';
const payloadSchema = z.object({meetings: z.array(z.record(z.string(), z.unknown()))});
const tags: Record<string,string> = {B:'beginner',W:'women',M:'men',O:'open',C:'closed',WC:'wheelchair_accessible',ES:'spanish'};
const text = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : null;
const coordinate = (value: unknown) => text(value) === null ? null : Number(value);

export function normalizeArizonaNa(data: unknown): unknown[] {
  const { meetings } = payloadSchema.parse(data);
  return meetings.filter(m => m.published === '1' && m.location_province === 'AZ').map(m => ({
    sourceMeetingId: text(m.id_bigint), fellowship:'NA', name:text(m.meeting_name),
    dayOfWeek: Number(m.weekday_tinyint) - 1,
    startTime: text(m.start_time)?.slice(0,5),
    timezone: text(m.time_zone),
    format: ({'1':'in_person','2':'online','3':'hybrid'} as Record<string,string>)[String(m.venue_type)],
    venueName:text(m.location_text), address:text(m.location_street),
    city:text(m.location_municipality), state:'AZ', postalCode:text(m.location_postal_code_1),
    latitude:coordinate(m.latitude), longitude:coordinate(m.longitude),
    onlineUrl:text(m.virtual_meeting_link), onlineNotes:text(m.virtual_meeting_additional_info),
    characteristics: (text(m.formats) ?? '').split(',').map(code => tags[code]).filter(Boolean),
    // Keep diagnostic scheduling/location fields, excluding contact details and admin notes.
    rawSourceData: {
      ...Object.fromEntries(['id_bigint','service_body_bigint','weekday_tinyint','start_time','duration_time','time_zone','venue_type','formats','location_province'].map(key => [key,m[key]])),
    }
  }));
}

export const arizonaNaAdapter: MeetingSourceAdapter = {
  async fetch() {
    const response = await fetch(arizonaNaFeed, {signal:AbortSignal.timeout(30_000)});
    if (!response.ok) throw new Error(`Arizona NA feed returned HTTP ${response.status}`);
    return response.json();
  },
  async normalize(data) { return normalizeArizonaNa(data); }
};
