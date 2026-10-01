# Automatic timezone repair

## Rule

Whenever an approved source's JSON enters the meeting import pipeline, fill a missing timezone from the meeting's city and state before validation. This applies to every fellowship and future adapter. Missing means absent, null, empty or whitespace-only. Preserve any explicit timezone, including invalid values so validation can report them.

## Implementation

1. Fetch JSON and normalize source field names as usual.
2. Run one shared timezone repair step in `syncSource`, before `meetingInputSchema` validation.
3. Match the normalized city exactly, ignoring case and extra whitespace, against the bundled `city-timezones` dataset. Use state and US country to distinguish cities with the same name. The current import contract is US-only; do not infer a country from a city name alone.
4. Use a unique city/state timezone, supplementing missing metro cities with reviewed city centres and bundled `geo-tz` boundaries. For unlisted or ambiguous cities, use the meeting's valid coordinates to handle small towns and daylight-saving boundary exceptions. Require a nonempty city and state for this repair. Never assign every Arizona record the same timezone.
5. When coordinates are absent, use the unique timezone from the exact city/state match. Unknown or ambiguous locations remain rejected with visible diagnostics rather than receiving an arbitrary timezone.
6. Preserve original public source fields. Add `timezoneResolution` metadata containing method, city, state and selected timezone, plus `timezoneAssumptionNote` for the existing detail-screen footnote. Never copy contact details or credentials.
7. Continue normal validation and transactional upserts. Other invalid fields still reject the record, and failed/partial feeds preserve existing listings.

The lookup runs offline and requires no API key or live geocoding request. Dependencies and geographic datasets are recorded in the lockfile. Future non-US adapters must extend the normalized country contract before using city-only lookup outside the US.

## Saved resolutions

Migration `003_timezone_cache` creates `timezone_location_cache` in PostgreSQL. Each import loads saved entries into a Map once, reuses them for all records, and inserts new resolutions. Known cities use normalized keys such as `US|AZ|phoenix`, so different Phoenix records reuse one saved timezone. Unlisted or ambiguous cities append precise coordinates to their keys to avoid conflating timezone boundaries. The database survives importer/API process restarts. Explicit source timezones are preserved and never used to overwrite the location cache.

Known city lookup assumes the city's schedules use the city-centre timezone. A city spanning timekeeping boundaries needs a reviewed exception before relying on city-wide cache reuse. Unresolved locations remain visible in rejection diagnostics. Geographic dataset upgrades require clearing affected cache entries and refreshing sources. Migration must be applied before running the updated importer.

## Replace the earlier patches

Remove Tempe-only NA and Tucson-only AA timezone assignments. Their raw normalizers must return the source timezone unchanged or null. The shared import rule replaces both so a new source cannot accidentally omit the repair.

## Verification and rollout

- Test null, missing, empty and whitespace timezones; explicit and invalid timezones; same-name cities in different states; unknown locations; coordinate boundary exceptions; provenance and unchanged raw data.
- Exercise the shared pipeline in a real PostGIS integration test, including unknown-location diagnostics and preservation of other validation failures.
- Refresh all approved development sources to recover previously rejected records and replace rejection snapshots.
- Confirm Wild Bunch IDs 19542, 19543 and 19544 appear through the running API with America/Phoenix, correct schedules and footnotes only on repaired records.
- Record import totals, remaining rejection reasons and checks in project records and the failure register.

References: [city-timezones](https://github.com/kevinroberts/city-timezones), [geo-tz](https://github.com/evansiroky/node-geo-tz).

## Previously resolved locations

Owner clarification, September 30, 2026: the earlier one-off fix had to be redone. Every incoming meeting JSON query must apply the missing-timezone rule. Reuse an already resolved timezone for the same normalized location before any external API request. Stored meetings already carry their timezone for ordinary finder queries. Current resolution uses offline datasets, with no timezone API request. That was the interim status before the cache implementation. Saved-resolution caching is now verified by the checks below. Cache identity must include city, state/region and country, with coordinate-sensitive handling for timezone boundary exceptions and retained provenance.

## Verified result, September 30, 2026

- Shared repair replaces the source-specific Tempe/Tucson patches and applies to every approved source import.
- Typecheck and client lint passed. All 51 tests passed, including seven real PostGIS integration tests.
- All six approved development sources refreshed. NA imported 471 schedules with zero skipped, recovering 346 previously rejected schedules. Six-source total is 2,980 stored active listings. Phoenix AA still has two unrelated invalid records and Recovery Dharma one schedule conflict.
- Running API returns Wild Bunch Sunday 17:30, Monday 19:00 and Tuesday 19:00, all America/Phoenix. Sunday and Tuesday retain repair footnotes; Monday preserves its explicit source timezone.
- `node --import tsx --env-file=.env scripts/verify-timezone-cache.ts` passed in a fresh process: 96 persisted entries, zero geographic lookups for saved Phoenix/Tempe/Tucson, unchanged cache after another NA import, 471 imported and zero skipped.
- Regression tests verify repeat city reuse and reuse by a new resolver, original raw data, explicit timezone preservation, same-name cities, unresolved locations and Chinle's America/Denver boundary exception.
