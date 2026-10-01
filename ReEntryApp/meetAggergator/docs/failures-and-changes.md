# Failures and required changes

Track failures discovered during development and changes the owner had to request. Add entries as they are found, with symptom, cause, owner correction, fix, verification and remaining scope. Do not mark an unverified fix as resolved.

## 1. Missing timezone excluded meetings from the finder

Status: resolved for current imports with shared location-based resolution and persistent cache, verified September 30, 2026.
Reported symptom: meetings did not show up on the map/finder. The documented reproduction was no NA meetings for Tempe on Monday. A map-rendering failure was not separately verified.

### Cause
The NA source supplied blank time_zone values. Import validation required a valid timezone and skipped those meetings before they reached the database. This made them unavailable to search and any display based on imported results.

### Change the owner requested
"yes do that for tempe, if you know the city and country why cant we just put in the timezone.... that should be simple enough"
The owner identified that a confirmed location should support resolving a missing timezone instead of silently losing otherwise valid meetings.

### How we fixed it
- For published records explicitly in AZ with municipality Tempe, the NA adapter supplies America/Phoenix when the source timezone is blank. This is year-round MST, UTC-7.
- Source-provided timezones remain unchanged. An invalid explicit timezone still fails validation.
- The adapter stores timezoneAssumptionNote in rawSourceData; the API returns it and the meeting detail screen displays the assumption footnote.
- Refreshed the NA import after the change. Tucson AA already had a separately approved America/Phoenix fallback.
- Docker/PostGIS availability was restored during that work. The database outage was a separate search failure.

### Verification and evidence
Historical September 29 verification: all 29 tests, typecheck and lint passed. NA import increased from 112 to 125 listings; 346 records remained skipped. Preview API returned Staying Clean for Dummies, Monday 9:30 AM, and Home Sweet Home, Monday 5:30 PM, both at Community Christian Church in Tempe. Detail API exposed the assumption footnotes.
September 30 documentation check: current adapter, regression tests, API projection and detail UI still contain this fix. No fresh import or runtime test was performed for this documentation entry.

Source files: apps/api/src/sources/arizona-na.ts; tests/arizona-na.test.ts; apps/api/src/repository.ts; apps/client/src/app/meetings/[id].tsx.
Historical evidence: logs/prompt-log.md, tempe-na-20260929 and tempe-fallback-20260929; logs/conversation-log.md, September 29 Tempe fallback entry.

### Remaining work
The earlier city-only patches were replaced by the shared resolver documented in ../TimezoneFix.md. Current NA import has zero rejections. Unknown/ambiguous locations without usable coordinates remain diagnostic errors; new country support and geographic dataset changes need explicit implementation. Native map execution remains a separate unverified area.

## 2. Search exclusions visible in browser console, September 30, 2026
Owner requested every search log otherwise eligible meetings missing from display, especially missing timezone. Finder now logs [Meeting search diagnostics], including omittedByLimit, rejectedCandidates, missingCoordinates and source status. Rejected records include all validation issue paths/messages and priorListingRetained. Unknown fields and upcoming times are explicitly unconfirmed. Live Mesa check: 280 matches, 50 displayed, 230 capped, 55 rejected candidates. Five-source snapshots refreshed; 38 tests, typecheck, lint and web rebuild passed. This diagnoses exclusions; it does not change timezone fallback policy or the default result cap. Adapter-level exclusions and unconnected sources remain coverage gaps.

## 3. Timezone fix had to be redone, September 30, 2026

Status: shared import resolver present; reuse/cache behavior and refreshed runtime results not verified in this documentation turn.

### Failure and cause
The first timezone fix was a one-off city/source patch. It repaired Tempe NA and Tucson AA but did not establish a rule for all incoming meeting data. Other locations, including two Wild Bunch schedules, still failed validation when their source timezone was blank. The owner had to request the timezone fix again.

### Owner correction and required behavior
Run timezone resolution whenever we query/pull meeting JSON into the shared processing pipeline and the timezone is missing. Preserve a valid source timezone. If the location's timezone has already been found, reuse that saved resolution instead of calling an API each time. Ordinary searches should use the timezone already stored on imported meetings.

Identify reusable resolutions by normalized city, state/region and country. Where coordinates determine the result, preserve geographic precision so a city-level cached value cannot override a timezone-boundary exception. Save successful resolutions with their provenance; unknown or ambiguous locations must remain visible in diagnostics.

### Current implementation and verification limits
Inspected apps/api/src/timezone.ts and TimezoneFix.md. The shared resolver uses bundled city-timezones and geo-tz data offline, so current resolution does not require an external timezone API. A reusable resolution cache was not verified. Do not describe the requested saved-lookup behavior or the complete rollout as tested merely because the resolver exists.

### Remaining work
Implement/verify reuse of previously resolved locations, test repeat queries and geographic boundary exceptions, and verify refreshed imports and live search results. This entry documents the repeated failure and owner requirement; it does not change application code.

## Shared timezone rule and saved resolutions, September 30, 2026
Owner required every source import to fill missing timezone from city and reuse saved resolutions. Implemented apps/api/src/timezone.ts before validation in syncSource. Removed Tempe/Tucson adapter assignments. Migration 003 stores city/state/country resolutions persistently; each import preloads a Map and writes only newly resolved entries. Known cities reuse city-wide keys; unlisted/ambiguous cities use coordinate-specific keys. Explicit source values remain intact; repaired records carry provenance and the existing detail footnote. No timezone network requests.

Verified typecheck, client lint and all 51 tests including seven PostGIS tests. All six sources refreshed: NA 471/0 skipped, Tucson AA 520/0, Phoenix AA 1891/2, CMA 73/0, MA 4/0, RD 21/1. NA recovered 346 schedules; Wild Bunch all three schedules returned by running API. Fresh-process verification found 96 persistent resolutions, zero geographic calls for saved Phoenix/Tempe/Tucson and unchanged cache after another 471/0 NA import. scripts/verify-timezone-cache.ts reproduces this check. Phoenix NA all days now returns 57 and zero rejected candidates.


## Android EAS dependency install failure, September 30, 2026
Failed build e690554b-bf1e-402b-a52b-40c11636e810 archived the nested apps/client Git root only. Cloud yarn install reported no lockfile and could not find @recovery/shared in the registry. The dependency is a private local npm workspace. Fix: scripts/build-android-preview.mjs sets the real project EAS_PROJECT_ROOT and EAS_NO_VCS, while root .easignore includes workspace manifests, root package-lock and packages/shared. Explicit archive audit confirmed required files and excluded credentials/generated data; npm ci dry-run succeeded. Replacement build 4aca7623-25a5-4d7b-9a44-08a75d20a8d6 passed dependency install, prebuild and eager bundle, Android compilation pending at this entry. Remote keystore reused. cli.appVersionSource warning fixed with remote policy. The localStorage experimental warning was not the dependency failure.
Owner requires port 8081. Preview APK uses http://192.168.0.35:8081 and local-preview-only cleartext flag; preview script supports PREVIEW_HOST and running instance listens on that Wi-Fi address. PC health and meeting search passed; physical phone connectivity unverified.

Android repair completion: replacement EAS build 4aca7623-25a5-4d7b-9a44-08a75d20a8d6 FINISHED; signed APK downloaded and verified. Original install failure resolved. Phone behavior and Wi-Fi access still unverified.

## Phone cannot reach preview, September 30
Server healthy at PC Wi-Fi address, listening 0.0.0.0:8081. User confirmed same Wi-Fi and no phone VPN/proxy. Explicit Node TCP block on Public Wi-Fi prevented inbound connections. Standard elevated sandbox command was not Windows administrator; mutation attempts failed Access denied. Prepared scripts/allow-preview-wifi.ps1 and launched via UAC; repair success verified in ActiveStore. Narrow Node 8081 allow rule limited to Wi-Fi/local IP/subnet; other TCP ports and all UDP remain blocked; all firewall profiles enabled. User confirmed phone /health shows ok and database connected after repair; native app behavior still needs device testing. No APK rebuild required.

