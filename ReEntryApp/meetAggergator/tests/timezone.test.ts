import { describe, expect, it, vi } from 'vitest';
import { fillMissingTimezone, createTimezoneResolver } from '../apps/api/src/timezone.js';
import { meetingInputSchema } from '@recovery/shared';
import { fixtureMeeting } from './fixtures.js';

const resolve = (changes: Record<string, unknown>) => fillMissingTimezone({...fixtureMeeting,timezone:null,...changes}) as Record<string, any>;
describe('Shared import timezone repair', () => {
  it('repairs every missing representation and preserves original source data', () => {
    for (const timezone of [null, undefined, '', '  ']) {
      const raw = {time_zone:timezone, id_bigint:'19542'};
      const m = resolve({timezone,rawSourceData:raw});
      expect(meetingInputSchema.safeParse(m).success).toBe(true);
      expect(m.timezone).toBe('America/Phoenix');
      expect(m.rawSourceData).toMatchObject({time_zone:timezone,timezoneResolution:{city:'Phoenix',state:'AZ',method:'city_state_dataset'}});
      expect(raw).not.toHaveProperty('timezoneResolution');
      expect(fillMissingTimezone(m)).toBe(m);
    }
  });
  it('reuses city cache across records and a fresh resolver without geographic work', () => {
    const cache = new Map();
    const lookup = vi.fn(() => ['America/Phoenix']);
    const first = createTimezoneResolver(cache, lookup);
    first({...fixtureMeeting,city:'Tempe',timezone:null});
    first({...fixtureMeeting,city:' tempe ',timezone:null,latitude:33.42});
    expect(lookup).toHaveBeenCalledTimes(1);
    const restart = createTimezoneResolver(new Map(cache), lookup);
    restart({...fixtureMeeting,city:'TEMPE',timezone:''});
    expect(lookup).toHaveBeenCalledTimes(1);
    first({...fixtureMeeting,timezone:null});
    first({...fixtureMeeting,timezone:null,latitude:33.51});
    expect(cache.get('US|AZ|phoenix').timezone).toBe('America/Phoenix');
    expect(lookup).toHaveBeenCalledTimes(1);
  });
  it('preserves explicit timezones, including invalid values for rejection', () => {
    for (const timezone of ['America/Denver','invalid',123]) {
      const record = {...fixtureMeeting,timezone};
      expect(fillMissingTimezone(record)).toBe(record);
    }
  });
  it('uses city and state without requiring coordinates, ignoring case and extra whitespace', () => {
    expect(resolve({city:'  tEMpe  ',state:'az',latitude:null,longitude:null}).timezone).toBe('America/Phoenix');
    expect(resolve({city:'Portland',state:'OR',latitude:null,longitude:null}).timezone).toBe('America/Los_Angeles');
    expect(resolve({city:'Portland',state:'ME',latitude:null,longitude:null}).timezone).toBe('America/New_York');
  });
  it('resolves Arizona daylight-saving boundary exceptions from meeting coordinates', () => {
    expect(resolve({city:'Chinle',latitude:36.1544,longitude:-109.5526}).timezone).toBe('America/Denver');
  });
  it('keeps unresolved locations and unrelated invalid fields rejected', () => {
    for (const changes of [{city:null},{state:'??'},{city:'Unknown fictional location',latitude:null,longitude:null}]) {
      expect(meetingInputSchema.safeParse(resolve(changes)).success).toBe(false);
    }
    const incomplete = resolve({longitude:null});
    expect(incomplete.timezone).toBe('America/Phoenix');
    expect(meetingInputSchema.safeParse(incomplete).success).toBe(false);
    expect(fillMissingTimezone(null)).toBeNull();
  });
});
