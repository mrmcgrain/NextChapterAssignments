import { expect, it } from 'vitest';
import { meetingInputSchema } from '@recovery/shared';
import { fixtureMeeting } from './fixtures.js';
it('preserves missing data without fabricating attributes', () => {
  const meeting=meetingInputSchema.parse(fixtureMeeting);expect(meeting.venueName).toBeNull();expect(meeting.onlineUrl).toBeNull();expect(meeting.endTime).toBeNull();
});
it('rejects bad timezones, dangerous online URLs and incomplete coordinates', () => {
  for(const change of [{timezone:'invalid'},{onlineUrl:'javascript:alert(1)'},{longitude:null},{startTime:'24:01'}]) expect(meetingInputSchema.safeParse({...fixtureMeeting,...change}).success).toBe(false);
});
