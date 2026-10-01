import { describe, expect, it } from 'vitest';
import { meetingInputSchema } from '@recovery/shared';
import { normalizePhoenixAa } from '../apps/api/src/sources/phoenix-aa.js';
const fixture={id:123,name:'Fictional AA fixture',day:2,time:'19:00',timezone:'America/Phoenix',attendance_option:'in_person',formatted_address:'123 Test St, Mesa, AZ 85202, USA',latitude:'33.4',longitude:'-111.8',approximate:'no',types:['O','D'],updated:'2026-09-01 10:00:00',author:'private fixture',entity_email:'private@example.invalid'};
describe('Phoenix AA normalization',()=>{
  it('parses source city/state, explicit timezone and source UTC update',()=>{
    const m=meetingInputSchema.parse(normalizePhoenixAa([fixture])[0]);expect(m).toMatchObject({sourceMeetingId:'123:2',city:'Mesa',address:'123 Test St',dayOfWeek:2,postalCode:'85202',sourceUpdatedAt:'2026-09-01T10:00:00.000Z',characteristics:['open','discussion']});
    expect(JSON.stringify(m.rawSourceData)).not.toContain('private');
  });
  it('does not expose approximate locations as precise physical addresses',()=>{
    const m=meetingInputSchema.parse(normalizePhoenixAa([{...fixture,attendance_option:'online',approximate:'yes',formatted_address:'Mesa, AZ, USA'}])[0]);expect(m.address).toBeNull();expect(m.latitude).toBeNull();expect(m.longitude).toBeNull();
  });
  it('expands multiple weekly days with stable distinct identifiers',()=>{
    const meetings=normalizePhoenixAa([{...fixture,day:[1,3]}]).map(m=>meetingInputSchema.parse(m));expect(meetings.map(m=>m.sourceMeetingId)).toEqual(['123:1','123:3']);
  });
  it('excludes other states and temporarily closed meetings, rejects missing timezones',()=>{
    expect(normalizePhoenixAa([{...fixture,formatted_address:'123 Test St, Reno, NV 89501, USA'},{...fixture,types:['TC']}])).toEqual([]);
    expect(meetingInputSchema.safeParse(normalizePhoenixAa([{...fixture,timezone:null}])[0]).success).toBe(false);
  });
});
