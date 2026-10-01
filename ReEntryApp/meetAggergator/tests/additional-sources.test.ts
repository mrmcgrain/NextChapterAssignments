import { describe,expect,it,vi,afterEach } from 'vitest';
import {meetingInputSchema} from '@recovery/shared';
import {arizonaCmaAdapter} from '../apps/api/src/sources/arizona-cma.js';
import {arizonaMaAdapter} from '../apps/api/src/sources/arizona-ma.js';
const fixture={id:1,name:'Fictional source fixture',day:0,time:'19:00',timezone:'America/Phoenix',attendance_option:'in_person',formatted_address:'123 Test St, Mesa, AZ 85202, USA',approximate:'no',types:[]};
afterEach(()=>vi.unstubAllGlobals());
describe('Additional fellowship adapters',()=>{
  it('preserves program identity across the shared TSML contract',async()=>{
    expect(meetingInputSchema.parse((await arizonaCmaAdapter.normalize([fixture]))[0]).fellowship).toBe('CMA');
    expect(meetingInputSchema.parse((await arizonaMaAdapter.normalize([fixture]))[0]).fellowship).toBe('MA');
  });
  it('discovers the public MA cache from the official page',async()=>{
    const mock=vi.fn().mockResolvedValueOnce(new Response('<script>source: "/wp-content/tsml-cache-abc123.json?123"</script>')).mockResolvedValueOnce(Response.json([fixture]));vi.stubGlobal('fetch',mock);
    expect(await arizonaMaAdapter.fetch()).toEqual([fixture]);expect(String(mock.mock.calls[1][0])).toBe('https://marijuana-anonymous.org/wp-content/tsml-cache-abc123.json?123');
  });
  it('fails closed when cache discovery changes',async()=>{
    const mock=vi.fn().mockResolvedValue(new Response('<p>No feed here</p>'));vi.stubGlobal('fetch',mock);await expect(arizonaMaAdapter.fetch()).rejects.toThrow('not found');expect(mock).toHaveBeenCalledTimes(1);
  });
});
