import type { MeetingSourceAdapter } from '@recovery/shared';
import { normalizeTsml } from './phoenix-aa.js';
export const arizonaMaDirectory='https://marijuana-anonymous.org/find-a-meeting/';
export const arizonaMaAdapter:MeetingSourceAdapter={
  async fetch(){
    // Follow only the public TSML JSON cache advertised by the official finder.
    // Discovering it each run avoids hard-coding a changing cache filename.
    const page=await fetch(arizonaMaDirectory,{signal:AbortSignal.timeout(30_000)});
    if(!page.ok)throw new Error('MA directory unavailable');
    const cache=(await page.text()).match(/\/wp-content\/tsml-cache-[a-z0-9]+\.json(?:\?\d+)?/)?.[0];
    if(!cache)throw new Error('MA public feed was not found; previous data preserved');
    const response=await fetch(new URL(cache,arizonaMaDirectory),{signal:AbortSignal.timeout(30_000)});
    if(!response.ok)throw new Error('MA source unavailable');return response.json();
  },
  async normalize(data){return normalizeTsml(data,'MA');}
};
