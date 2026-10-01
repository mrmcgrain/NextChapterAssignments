import { z, type MeetingSourceAdapter } from '@recovery/shared';
import { normalizeTsml } from './phoenix-aa.js';

export const recoveryDharmaFeed = 'https://recoverydharma.org/wp-admin/admin-ajax.php?action=meetings';
// Verified against the official directory's type definitions. RD's BB means
// Language - Other, so AA's BB -> book_study mapping must not be reused here.
const tags: Record<string,string> = {
  O:'open', C:'closed', BE:'beginner', FDIS:'discussion', FBS:'book_study',
  FSPK:'speaker', ILGB:'lgbtq', EN:'english', ES:'spanish',
};
export function normalizeRecoveryDharma(data: unknown): unknown[] {
  const records = z.array(z.record(z.string(),z.unknown())).parse(data);
  return normalizeTsml(records,'Recovery Dharma',tags).map(record => {
    const meeting = record as Record<string,unknown>;
    // Preserve this source record in rejection diagnostics until the conflicting
    // published schedule is corrected. Do not guess between 09:00 and 08:00.
    if (meeting.sourceMeetingId === '248391:0' && meeting.startTime === '09:00'
      && String(meeting.name).includes('Meeting time will switch to 8am on March 29, 2026')) {
      return {...meeting,startTime:null};
    }
    return meeting;
  });
}
export const recoveryDharmaAdapter: MeetingSourceAdapter = {
  async fetch() {
    const response = await fetch(recoveryDharmaFeed,{signal:AbortSignal.timeout(30_000)});
    if (!response.ok) throw new Error(`Recovery Dharma feed returned HTTP ${response.status}`);
    return response.json();
  },
  async normalize(data) { return normalizeRecoveryDharma(data); }
};
