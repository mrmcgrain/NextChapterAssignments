import { describe, expect, it } from 'vitest';
import { fillMissingTimezone } from '../apps/api/src/timezone.js';
import { meetingInputSchema } from '@recovery/shared';
import { normalizeTucsonAa } from '../apps/api/src/sources/tucson-aa.js';
const fixture = {id:1,name:'Test fixture',day:1,time:'18:00',attendance_option:'in_person',formatted_address:'123 Test St, Tucson, AZ, USA'};
describe('Tucson timezone assumption',()=>{
  it('uses year-round MST and records the footnote when timezone is missing',()=>{
    const m = meetingInputSchema.parse(fillMissingTimezone(normalizeTucsonAa([fixture])[0]));
    expect(m.timezone).toBe('America/Phoenix');
    expect(m.rawSourceData).toMatchObject({timezoneAssumptionNote:expect.stringContaining('Tucson')});
  });
  it('preserves an explicit source timezone without an assumption footnote',()=>{
    const m = meetingInputSchema.parse(normalizeTucsonAa([{...fixture,timezone:'America/Denver'}])[0]);
    expect(m.timezone).toBe('America/Denver');
    expect(m.rawSourceData).not.toHaveProperty('timezoneAssumptionNote');
  });
  it('continues excluding records outside Arizona',()=>{
    expect(normalizeTucsonAa([{...fixture,formatted_address:'Test St, Denver, CO, USA'}])).toEqual([]);
  });
});

