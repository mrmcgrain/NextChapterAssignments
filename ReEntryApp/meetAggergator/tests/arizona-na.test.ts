import { describe, expect, it } from 'vitest';
import { fillMissingTimezone } from '../apps/api/src/timezone.js';
import { meetingInputSchema } from '@recovery/shared';
import { normalizeArizonaNa } from '../apps/api/src/sources/arizona-na.js';

// Fictional records exercising the verified BMLT field contract.
const record = {id_bigint:'fixture-1',published:'1',location_province:'AZ',meeting_name:'Fictional adapter fixture',weekday_tinyint:'1',start_time:'18:30:00',time_zone:'America/Phoenix',venue_type:'1',formats:'B,W,O,UNKNOWN',location_municipality:'Mesa',latitude:'33.4',longitude:'-111.8',contact_email_1:'fixture@example.invalid',admin_notes:'private fixture'};
describe('Arizona NA adapter', () => {
  it('maps BMLT days, times, formats and explicit timezone without inventing missing fields', () => {
    const meeting = meetingInputSchema.parse(normalizeArizonaNa({meetings:[record]})[0]);
    expect(meeting).toMatchObject({dayOfWeek:0,startTime:'18:30',timezone:'America/Phoenix',format:'in_person',endTime:null,address:null,characteristics:['beginner','women','open']});
    expect(JSON.stringify(meeting.rawSourceData)).not.toContain('private fixture');
    expect(JSON.stringify(meeting.rawSourceData)).not.toContain('fixture@example.invalid');
  });
  it('excludes unpublished and non-Arizona records', () => {
    expect(normalizeArizonaNa({meetings:[{...record,published:'0'},{...record,location_province:'CA'}]})).toEqual([]);
  });
  it('leaves absent timezone and incomplete coordinates invalid for safe import skipping', () => {
    for (const changes of [{time_zone:''},{longitude:''}]) {
      expect(meetingInputSchema.safeParse(normalizeArizonaNa({meetings:[{...record,...changes}]})[0]).success).toBe(false);
    }
  });
  it('rejects malformed feed envelopes', () => {
    expect(() => normalizeArizonaNa({error:'feed unavailable'})).toThrow();
  });
  it('imports Monday Tempe records with missing timezone and assumption provenance', () => {
    for (const time_zone of ['', '  ', undefined]) {
      const meeting = meetingInputSchema.parse(fillMissingTimezone(normalizeArizonaNa({meetings:[{...record,location_municipality:' tEMpe ',weekday_tinyint:'2',time_zone}]})[0]));
      expect(meeting).toMatchObject({dayOfWeek:1,timezone:'America/Phoenix',rawSourceData:{timezoneAssumptionNote:expect.stringContaining('America/Phoenix')}});
    }
  });
  it('preserves explicit Tempe timezone and rejects invalid explicit timezone', () => {
    const explicit = normalizeArizonaNa({meetings:[{...record,location_municipality:'Tempe',time_zone:'America/Denver'}]})[0];
    const meeting = meetingInputSchema.parse(explicit);
    expect(meeting.timezone).toBe('America/Denver');
    expect(meeting.rawSourceData).not.toHaveProperty('timezoneAssumptionNote');
    expect(meetingInputSchema.safeParse(normalizeArizonaNa({meetings:[{...record,location_municipality:'Tempe',time_zone:'invalid'}]})[0]).success).toBe(false);
  });
  it('keeps raw missing timezones for shared repair and incomplete coordinates for validation', () => {
    for (const changes of [{location_municipality:'Mesa'},{location_municipality:''},{location_municipality:'Tempe',longitude:''}]) {
      expect(meetingInputSchema.safeParse(normalizeArizonaNa({meetings:[{...record,time_zone:'',...changes}]})[0]).success).toBe(false);
    }
    expect(normalizeArizonaNa({meetings:[{...record,location_municipality:'Tempe',location_province:'CA',time_zone:''}]})).toEqual([]);
  });
});

