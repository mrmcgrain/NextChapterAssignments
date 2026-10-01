import {describe,it,expect} from 'vitest';
import {meetingInputSchema} from '@recovery/shared';
import {normalizeRecoveryDharma} from '../apps/api/src/sources/recovery-dharma.js';
const fixture = {id:1,name:'RD fixture',day:0,time:'19:00',timezone:'America/Phoenix',attendance_option:'in_person',formatted_address:'123 Test St, Mesa, AZ 85202, USA',types:['FDIS','FBS','ILGB','EN','O','BB','UNKNOWN']};
describe('Recovery Dharma source semantics',()=>{
  it('maps RD codes without interpreting its BB language code as AA Big Book',()=>{
    const m=meetingInputSchema.parse(normalizeRecoveryDharma([fixture])[0]);
    expect(m.fellowship).toBe('Recovery Dharma');
    expect(m.characteristics).toEqual(['discussion','book_study','lgbtq','english','open']);
    expect(meetingInputSchema.parse(normalizeRecoveryDharma([{...fixture,types:['BB']}])[0]).characteristics).toEqual([]);
  });
  it('rejects the conflicting Mesa schedule but accepts a corrected source time',()=>{
    const m={...fixture,id:248391,name:'RD **Meeting time will switch to 8am on March 29, 2026**',time:'09:00'};
    expect(meetingInputSchema.safeParse(normalizeRecoveryDharma([m])[0]).success).toBe(false);
    expect(meetingInputSchema.parse(normalizeRecoveryDharma([{...m,time:'08:00'}])[0]).startTime).toBe('08:00');
  });
  it('preserves distinct source IDs and excludes outside-Arizona records',()=>{
    const rows=normalizeRecoveryDharma([fixture,{...fixture,id:2},{...fixture,id:3,formatted_address:'123 Test St, Denver, CO 80202, USA'}]);
    expect(rows.map(m=>meetingInputSchema.parse(m).sourceMeetingId)).toEqual(['1:0','2:0']);
  });
});
