import type { MeetingSourceAdapter } from '@recovery/shared';
import { normalizeTsml } from './phoenix-aa.js';

export function normalizeTucsonAa(data: unknown) {
  return normalizeTsml(data, 'AA');
}
export const tucsonAaAdapter: MeetingSourceAdapter = {
  async fetch() {
    const response = await fetch('https://aatucson.org/wp-admin/admin-ajax.php?action=meetings',{signal:AbortSignal.timeout(30_000)});
    if (!response.ok) throw new Error(`Tucson AA feed returned HTTP ${response.status}`);
    return response.json();
  },
  async normalize(data) { return normalizeTucsonAa(data); }
};
