import type { MeetingSourceAdapter } from '@recovery/shared';
import { normalizeTsml } from './phoenix-aa.js';
export const arizonaCmaFeed='https://www.crystalmeth.org/wp-admin/admin-ajax.php?action=meetings';
export const arizonaCmaAdapter:MeetingSourceAdapter={
  async fetch(){const response=await fetch(arizonaCmaFeed,{signal:AbortSignal.timeout(30_000)});if(!response.ok)throw new Error('CMA source unavailable');return response.json();},
  async normalize(data){return normalizeTsml(data,'CMA');}
};
