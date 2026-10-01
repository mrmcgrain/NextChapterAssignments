# Recovery Dharma feed validation

Verified September 30, 2026 with a read-only HTTP request and the existing TSML normalizer and meetingInputSchema. No database import performed.

- Official directory: https://recoverydharma.org/meetings/
- Official crawler index: https://recoverydharma.org/locations/
- JSON endpoint: https://recoverydharma.org/wp-admin/admin-ajax.php?action=meetings
- HTTP 200; 955 worldwide source records; 22 Arizona records.
- All 22 Arizona records pass current normalization/schema checks using fellowship RD.
- Formats: 17 in-person and 5 online source listings. These are not verified unique meetings.
- All 22 explicitly supply America/Phoenix. No timezone assumptions needed.
- Relevant feed fields include id, day, time, end_time, timezone, attendance_option, types, formatted_address, approximate, latitude and longitude.

## Data issues before import

- Record 248391, Mesa Sunday: structured time is 09:00, but name says meeting time switches to 08:00 on March 29, 2026. Do not silently choose a time; exclude or flag for source confirmation.
- Potential duplicate online pairs: 248086/250042, Monday 19:00 Phoenix, and 248089/250044, Monday 19:30 Phoenix. Matching city/time alone does not prove duplication. Confirm source URLs and group identity before collapsing records.
- Current AA-oriented type map misses RD codes FDIS discussion, FBS book study and ILGB LGBTQIA+. Use source-specific mappings before integration; do not infer meditation or accessibility for every RD meeting.
- The website displays CC BY-NC 4.0. Applicability to meeting data and commercial reuse remains unresolved; existing production sync restrictions remain applicable.

## Next steps

Add an RD-specific adapter with type mapping and a documented policy for conflicting schedules. Preserve source attribution/IDs and exclude contact/access credentials from stored raw data. Validate duplicate candidates and import eligible Arizona records only after resolving the conflict policy. Public feed availability does not establish production redistribution rights.
