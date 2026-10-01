# Project State

## Sobriety.tools API assessment, September 30, 2026
- Key found in owner-specified
- Public developer page claims 400+ service entities, AA/NA/CMA/SMART/Recovery Dharma/Wellbriety coverage and 1,000 requests/hour with a key. Actual Arizona coverage unverified.
- Preliminary public-API comparison: ours 2,634, their AZ-labelled sample 2,577, confident AA overlap 2,095; 539 ours and 482 theirs unmatched, with 317 uncertain pairs. Not a complete coverage comparison: Saturday queries rate-limited, 389 fetched missing-state IDs excluded and geographic searches may omit online listings.
- API https://jb4l-meeting-api.erich-owens.workers.dev/v1/meetings accepts lat/lng/radius/day/program/limit, caps at 500; tested offset ignored. Use bearer authentication after key approval. scripts/compare-sobriety.mjs and docs/sobriety-comparison.md preserve reproducible test and caveats; allowlisted report in output/sobriety-comparison/report.json.
- Sample adds 14 SMART and 22 Wellbriety listing IDs; all remote AZ rows omit timezone/source attribution, most omit city. Found 31 remote and 14 local extra duplicate-candidate rows. Review before imports/deletions. Complete collection after approval or quota reset; verify missing-state rows and reuse scope.
-

## Objective
Arizona-first anonymous recovery meeting finder following recovery-meeting-finder-lean-mvp/lean-mvp-prd.md.

## Architecture
Expo SDK 57 / React Native / Expo Router -> Fastify REST API -> PostgreSQL/PostGIS. Shared Zod validation. Approval-gated adapters validate schedules before transactional upserts using stable source identifiers. Failed, empty and partial imports preserve previous records.

## Important Files
- apps/client/src/app/: finder, detail, correction report routes.
- apps/api/src/app.ts and repository.ts: health, search, upcoming, details, source status, reports and protected internal report listing.
- apps/api/src/sources/: NA BMLT adapter, AA/CMA TSML adapters, MA public-cache discovery, source registry.
- apps/api/src/sync-cli.ts: independent per-source refresh and development registration.
- database/migrations/001_initial.sql, compose.yaml: PostGIS schema and localhost database.
- scripts/test-postgis.mjs: isolated recovery_test migration and full test suite.
- scripts/preview.mjs: serves apps/client/dist-verified on 8081.
- docs/source-approval.md, docs/verification.md: coverage and verification boundaries.

## Services
Web preview http://127.0.0.1:8081; Fastify http://localhost:3001; local PostGIS localhost:54329. Database restored and health verified connected after starting project container; API and preview restored. GET /api/v1/sources exposes approved enabled sources, last sync status/time and listing counts. No production deployment. Internal reports disabled unless INTERNAL_API_TOKEN is configured.

## Environment
Windows PowerShell, Node 26.8.1, npm 12.0.2, Docker engine 29.7.2. Development and isolated test databases migrated. No commit or push performed.

## Decisions
- No accounts, favorites or check-ins in lean scope.
- Source product approval established; production redistribution terms remain unresolved. Registration CLI blocks production until permission is documented.
- Only explicitly Arizona records with valid schedules are imported. User authorized America/Phoenix, year-round MST, for missing Tucson AA timezones; records retain an assumption footnote. All source imports now use shared missing-timezone repair by city/state, with geographic fallback for unlisted/ambiguous cities and persistent saved-resolution reuse. Explicit source timezones remain intact; repaired records retain provenance and footnotes.
- City search ignores case. ZIP and ZIP+4 resolve through the server-side Zippopotam.us lookup to an Arizona city when Search or Find a Meeting Now is pressed. Search uses that city and shows the resolved location; invalid, unknown, out-of-state and unavailable lookups show actionable errors. Coordinates require foreground permission and stay in screen state.
- Request logging disabled to avoid storing searches, coordinates or report notes.
- Root overrides pin SDK-compatible Reanimated/Worklets.

## Known Issues
- Database outage resolved during Tempe fix; health and proxied search verified.
- Tempe NA missing timezone resolved with owner-approved city-scoped fallback; both Monday records verified through preview API.
- NA timezone rejection resolved: 471 imported and zero skipped after shared resolver/cache rollout.
- AA import is partial: 1,891 imported, two invalid records skipped; seven records filtered as outside Arizona or temporary closures.
- Tucson AA imported 520 eligible Arizona listings using the owner-authorized MST assumption and visible detail footnote. No usable CA JSON endpoint found in initial inspection.
- SMART Recovery, Celebrate Recovery and Al-Anon adapters pending. Recovery Dharma is implemented; the registry confirms its adapter.
- 13 moderate npm audit findings remain in Expo dependency chains.
- Native installs, signed builds, production reuse permission and deployment unverified.

## Current Work
Six approved sources refreshed: Tucson AA 520; Phoenix AA 1,891; Arizona NA 471; Arizona CMA 73; Arizona MA 4; Recovery Dharma 21. Total 2,980 active listings. NA zero rejections; Phoenix AA two unrelated invalid records and RD one schedule conflict remain.

## TODO
- Add remaining approved sources after validating feed contracts and timezone information.
- Configure scheduled refresh; npm run sync:sources currently performs manual refresh.
- Complete street-address geocoding, maps, fuller filter UX and no-result broadening.
- Implement validated AI filter interpretation with ordinary-search fallback.
- Verify native devices, release configuration and dependency advisories.
- Confirm redistribution terms before public release.

## Last Known Working State
September 29, 2026: database migration and four-source live import succeeded. All 23 tests passed across six files including three real PostGIS integration tests. Typecheck, client lint and rebuilt web export passed. Live health and source-status endpoints passed; Playwright Mesa AA search and source-attributed detail passed. Earlier Expo Doctor 21/21 and combined web/iOS/Android bundle exports passed; native device execution remains unverified.

September 29 Tucson update: 26 tests passed including three PostGIS tests; typecheck, lint and web rebuild passed. Explicit timezones preserved, assumption metadata retained in raw source JSON and exposed as timezoneAssumptionNote.


Preview compatibility update: built web uses same-origin API requests through scripts/preview.mjs. Preview page, /health and /api/v1/meetings are served on 8081; upstream API stays on 3001. For standalone Expo dev server set EXPO_PUBLIC_API_URL=http://localhost:3001 in apps/client/.env. Typecheck/lint/export and proxied live requests passed; Codex browser rendering unconfirmed because CDP focus command timed out.

## Project records
Exact turn transcript: logs/prompt-log.md, recording began with this diagnostic; earlier full transcripts unavailable. Obsidian mirror: F:\Obsidian\SecondBrain\01-Projects\meetAggergator. Records mirror managed by SHA-256 verification through project-records sync helper.


Project records: logs/prompt-log.md begins with current source-example request; earlier exact transcript coverage incomplete. Source examples: docs/source-json-examples.md; script scripts/source-examples.ts can regenerate excerpts and real rows when database is available. Mirror target F:\




## Source expansion research, September 29, 2026
- Current registry inspected: Tucson/Phoenix AA, Arizona NA, CMA and MA. No new adapters or imports in this research turn.
- Candidate priority: Recovery Dharma, additional Arizona AA feeds, BMLT aggregator comparison, then SMART/Al-Anon/Celebrate Recovery.
- BMLT Tomato is now the worldwide aggregator: https://github.com/bmlt-enabled/aggregator. It covers known root servers; complete US NA coverage is unverified.
- Recovery Dharma official crawler index https://recoverydharma.org/locations/ includes Arizona meetings. JSON contract and timezone fields remain unverified. Site displays CC BY-NC 4.0 notice; meeting-data reuse applicability needs clarification.
- Claimed 178 AA feeds and all-state coverage unverified; requires endpoint inventory.
-

September 29 Tempe verification: 29 tests passed including real PostGIS tests; typecheck and lint passed. Proxied Tempe/NA/Monday search returns both meetings; detail API returns assumption footnotes.


ZIP search verification: 30 tests passed, 3 database integration tests skipped; typecheck and client lint passed. Running API and preview proxy resolved 85281 to Tempe, AZ; live Tempe search returned 50 listings. Browser visual verification blocked by net::ERR_BLOCKED_BY_CLIENT. ZIP lookup uses https://api.zippopotam.us/us/{zip}, a five-second timeout and no API key. Earlier database-outage note is historical; current meeting endpoint responded successfully.

ZIP search web export to dist-verified completed successfully.

Current status: Docker recovered, PostGIS healthy and API connected. Five-source stored rows verified in docs/source-json-examples.md. Earlier backend exit cause unknown.

## Meeting filter breadcrumbs
Finder has grouped characteristic selectors, removable chips, counts and clear-all. Current source tag mappings enable discussion, speaker, book study, step study, meditation, audience, wheelchair, attendance, English and Spanish. Options without source mappings are hidden from the filter screen; Full Accessibility is absent until bathroom access is supported. All selected tags use existing API AND matching. Changes require Search meetings to refresh results. September 30 typecheck, lint and web export passed after hiding unavailable controls; browser and native interaction were not rechecked.


## Recovery Dharma validation, September 30, 2026
Public TSML endpoint verified HTTP 200: 955 worldwide records, 22 Arizona listings, all 22 schema-valid with explicit America/Phoenix. 17 in-person and 5 online listings. No import performed. docs/recovery-dharma-validation.md records a Mesa schedule conflict, possible duplicate online pairs, source-specific tag mappings and unresolved reuse terms. Next work: RD adapter with conflict handling and duplicate review before import.

## Local preview September 30, 2026
Preview http://127.0.0.1:8081 and API 3001 started; PostGIS container restored. Page and meeting search HTTP 200; health database connected; five stored sources total 2,613 listings. Codex browser open request queued. API required elevated startup after sandbox uv_os_get_passwd ENOMEM. No public deployment.


September 30 record sync attempted with approved helper: incomplete due to conflict or external edit in F:\

## Multiple filter selection, September 30, 2026
Program, format and day selectors now toggle multiple values. Individual breadcrumbs remove only their own value; group reset and clear-all remain available. Programs/formats/days match ANY within each group; characteristics require ALL. API accepts daysOfWeek comma-separated integers and retains dayOfWeek compatibility. Now mode still ignores days/time. Typecheck, lint, rebuilt dist-verified and all 35 tests including four PostGIS tests passed. Browser/native interaction not verified this turn.

## Failure tracking
Canonical register: docs/failures-and-changes.md. Track discovered failures and owner-requested changes as work continues. Entry 1 documents missing-timezone import rejection, the Tempe NA fallback, historical verification and remaining general resolver work. Obsidian note target: F:\Obsidian\SecondBrain\01-Projects\meetAggergator\Failures and required changes.md.


Failure register


## Search exclusion diagnostics, September 30, 2026
- Every finder search requests /api/v1/meetings/diagnostics and console.logs matching limit omissions, potentially matching validation rejections, missing-coordinate radius candidates and source sync status. Search/diagnostics errors also log. Diagnostics failure does not suppress ordinary results.
- sources.rejected_meetings stores allowlisted public meeting fields and all validation issue paths/messages from instrumented syncs; raw/contact data excluded. Migration 002 applied locally and in recovery_test. Existing valid listings remain preserved; diagnostic priorListingRetained identifies rejected updates with a stored active listing.
- Latest five-source refresh: Tucson AA 520, NA 125 with 346 rejected, Phoenix AA 1,891 with 2 rejected, CMA 73, MA 4. Total valid stored listings unchanged at 2,613.
- API restarted and preview web rebuilt. Live Mesa diagnostics: 280 matches, 50 returned, 230 limit omissions, 55 rejected candidates. Tempe now diagnostics responded successfully. Typecheck/lint passed; 38 tests including five PostGIS tests passed.
- Limits: rejected records are candidates when missing data prevents confirming requested criteria. Now-window membership is unconfirmed for rejected records. Adapter exclusions and unconnected sources are not enumerated. No browser console interaction verified this turn.

## Upcoming-search scrolling, September 30, 2026
Find a Meeting Now animates to the listings section once search completes, including empty/error states. Target uses measured layout offsets. Typecheck, lint and dist-verified web rebuild passed. Browser/native interaction not verified.

## Load more pagination, September 30, 2026
- Finder retrieves 50 listings per request. Load more appends cards, displays loaded count and disappears at exhaustion. Visible note: "We can only receive 50 listings at a time. Select Load more to see the next listings."
- API regular/now searches return meetings, hasMore, nextOffset and asOf. Validated offset with stable ordering and one-row lookahead identifies the last page. Now pagination keeps the initial asOf window fixed.
- Client retains original submitted query, guards duplicate page requests/stale responses, deduplicates IDs and preserves loaded cards on page errors with retry. Diagnostics include all loaded offsets in cumulative omitted-by-limit calculation.
- Verified browser Mesa 50 -> 100 -> 150 -> 200 -> 250 -> 280 and final button removal. Editing city to Tempe before Load more retained Mesa query. All 40 tests including six PostGIS tests passed; typecheck/lint and web export passed. API restarted; local preview current. Native interaction unverified.
- Offset pagination assumes unchanged source data during browsing; source refresh between pages can shift ordering. No production deployment or new imports this turn.

September 30 validation explanation: live Mesa diagnostics returned 55 rejected candidates, all with null timezone. Mandatory normalized fields verified in packages/shared/src/index.ts. No schema or adapter changes.

## Recovery Dharma import and filters, September 30, 2026
- Registered development source recovery-dharma; imported 21 Arizona listings, one rejected due to published Mesa Sunday schedule conflict. All imported records retain explicit timezones and source IDs. Possible online duplicate pairs remain separate pending confirmation.
- RD-specific mappings FDIS discussion, FBS book_study, FSPK speaker, ILGB lgbtq, EN english, ES spanish, O/C attendance, BE beginner. AA mappings remain unchanged. RD BB means Language - Other and is not mapped as Big Book.
- Finder supports English; book_study label now Book Study / Big Book. Recovery Dharma fellowship option already existed and matches imported program name. Source completeness explanation added; no tags inferred from names.
- Verified 43 tests including local PostGIS, typecheck, lint and dist-verified web export. Live preview API: RD 21, book_study 1, lgbtq 1, english 20, discussion 0. Browser/native interaction unverified this turn.
- New files apps/api/src/sources/recovery-dharma.ts and tests/recovery-dharma.test.ts. docs/source-approval.md documents development integration; production remains blocked pending reuse terms.

## Meeting results map, September 30, 2026
- Search results include an auto-fitted Leaflet/OpenStreetMap map with dots grouped by exact coordinates, schedule popups and detail navigation. Web renders Leaflet directly in the page using bundled leaflet JS/CSS. All matches come from /api/v1/meetings/map independent of list pagination, sharing filters and upcoming asOf instant. Online/missing-coordinate matches counted explicitly; map failure preserves list.
- Native implementation uses Expo-compatible react-native-webview 13.16.1; native devices unverified. Web Leaflet is bundled; native still uses Leaflet CDN. Both need network access to OSM tiles.
- Verified typecheck, lint, 38 tests passed/6 integration tests skipped, web export and live browser Mesa AA: 278 matches, 277 mapped, one online, 32 location dots; dot popup/detail navigation passed.
- API/preview restored on 3001/8081. Restricted API startup failed uv_os_get_passwd ENOMEM; approved elevated startup succeeded.
-

## OpenStreetMap tile failure
- Web tile failure resolved September 30. Sandboxed srcdoc and served-page attempts both sent empty Referer. Rendering bundled Leaflet directly in the page sends Referer http://127.0.0.1:8081/ under strict-origin-when-cross-origin; real street tiles visually verified. No API key/account needed.
- Verified typecheck, lint and rebuilt web export. Live Mesa AA showed 277 mapped/278 matches and 32 dots; location popup and detail navigation passed. Screenshot logs/map-referrer-fixed.png. Native identification/device rendering remain unverified.
- Recaps: root dailyprompt.md, weeklyprompt.md, allPrompts.md; documented mirror F:\Obsidian\SecondBrain\01-Projects\meetAggergator. Coverage partial.



## Wild Bunch inspection, September 30, 2026
Resolved: Wild Bunch 19542 Sunday 17:30, 19543 Monday 19:00 and 19544 Tuesday 19:00 all stored as America/Phoenix. 19542/19544 carry automatic-resolution footnotes; explicit 19543 unchanged. Phoenix NA now returns 57 schedules and no rejected candidates. Historical pre-fix evidence remains in logs/wild-bunch-source.json and logs/wild-bunch-diagnostics.json.

## Timezone correction follow-up, September 30, 2026
Failure register entry 3 documents the repeated repair: earlier city/source patches were one-off fixes. Shared offline resolver is now present in apps/api/src/timezone.ts; saved-resolution reuse is required but not verified. Apply missing-timezone repair on incoming JSON queries, reuse known normalized locations before external API requests, preserve coordinate boundary exceptions and provenance. Ordinary searches use stored meeting timezone. Documentation-only turn; no code or runtime checks.


September 30 follow-up: exact

## Filters dropdown, September 30, 2026
All optional filter controls now live inside a collapsed-by-default Filters disclosure above the selected breadcrumbs. Includes conditional nearby radius. Selections persist when closed; breadcrumbs and Search stay visible. Typecheck, lint and dist-verified export passed. Browser CLI yielded no usable verification; native interaction unverified.

## Automatic timezone repair and cache
Policy: TimezoneFix.md. Shared step apps/api/src/timezone.ts runs before validation in apps/api/src/sync.ts for all sources. Missing/null/blank values resolved by normalized US city/state; known cities use shared city keys, unlisted/ambiguous cities require coordinates with precise cache keys. PostgreSQL timezone_location_cache from migration 003 persists resolutions, preloaded to a Map once per import. New entries only are inserted; explicit source values preserved. Original public source data and timezoneResolution/assumption footnotes retained. Unsupported countries and unresolved locations remain diagnostic errors.
Verified September 30: typecheck, client lint, 51 tests including seven real PostGIS tests. All six sources refreshed, 346 NA schedules recovered. Fresh-process scripts/verify-timezone-cache.ts passed with 96 persisted entries, zero geographic calls for saved cities and unchanged cache after repeat 471/0 NA import. All Wild Bunch schedules verified through running API. No client behavior change or public deployment.



## Project location migration, September 30, 2026
- Current root: G:\23\nextChapter\NextChapterAssignments\ReEntryApp\meetAggergator
- Moved the entire ReEntryApp folder into NextChapterAssignments. Original transcript paths remain historical. npm workspace junctions now target the current root. No commit or push.
- Existing database container and volume preserved. Codex chat remains attached to old folder; reopen the current root in Codex.
-

Migration verified 2026-09-30 13:16:19 -07:00: typecheck passed; restarted API/preview at new root, direct/proxied health database connected, preview HTTP 200 and Phoenix NA meeting query responded. Empty old app folder remains locked; reopen new root in Codex and remove old empty folders after handles close.

## Record reconciliation, September 30, 2026
- Current root: G:\23\nextChapter\NextChapterAssignments\ReEntryApp\meetAggergator
- Mirror: F:\Obsidian\SecondBrain\01-Projects\meetAggergator
- All four standard records and three recap files passed both installed sync helpers and independent SHA-256 equality checks before pending status was cleared. No record or recap synchronization remains pending.
- Both original versions, manifests, generated indexes, comparison diffs and original hashes preserved in logs/record-reconciliation/20260930-141010. Obsidian-only transcript entries: zero. Older recap timestamps preserved as historical metadata. Older mirror state assertions preserved in the comparison report and conversation history, not treated as current facts.
- Transcript coverage remains partial for unavailable earlier chats. Current reconciliation turn includes exact user text, visible commentary and finalized final response. No application code, commit or push in this task.

Preview rehost verified 2026-09-30 14:32 -07:00 at current migrated root: localhost 8081 page and Phoenix search HTTP 200, database connected; browser open queued.

Current record sync: newline-only mirror changes reconciled after preserving both versions and confirming every mirrored record is a text prefix of its local source. All seven files synchronized with hash verification; no pending sync. Process responsible for newline changes unknown.
`nAndroid configuration inspected September 30: Expo SDK 57; EAS build profiles present; expo-updates and OTA configuration absent. Installed APK type unverified. Typecheck passed; lint could not write its cache, EPERM. No application changes.
Recap sync conflict resolved after prefix comparison and preservation of both originals; installed recap helper verified all three recaps and index. Standard records synced at turn completion.

## Android build attempt, September 30
Expo sign-in and project linking completed. Failed build e690554b-bf1e-402b-a52b-40c11636e810 could not find @recovery/shared because only client was archived. Wrapper scripts/build-android-preview.mjs uses EAS_NO_VCS with explicit real workspace root and root .easignore. Repaired build 4aca7623-25a5-4d7b-9a44-08a75d20a8d6 FINISHED successfully; install, prebuild, bundling and native compilation passed. APK logs/build-artifacts/recovery-meeting-finder-preview.apk, 99,370,396 bytes, SHA256 7F85D3EEEBEEC78E5424A7FE4C8D42562914FF6DC1B747AA0CB3DDAAA6BCFE4C. AndroidManifest.xml/classes.dex verified. Existing Expo keystore reused. Preview profile uses http://192.168.0.35:8081 and preview-only HTTP flag. Preview listens on 0.0.0.0 via PREVIEW_HOST so localhost and Wi-Fi both work; /health and meeting search verified from PC. Physical phone connectivity unverified. Typecheck/lint passed; archive inspected and npm dry-run passed. Recap conflict resolved with preserved originals; all recap copies hash-verified.





## Phone Wi-Fi access repair
Confirmed Public-profile Node TCP firewall block. Administrator UAC repair succeeded: RecoveryMeetingFinder-Preview-8081-WiFi allows Node TCP 8081 only on Wi-Fi/local192.168.0.35/remote192.168.0.0/24. Original Node TCP block retained on other ports; UDP block and all firewall profiles retained. ActiveStore verified. Backup logs/firewall-8081-before.json; helper scripts/allow-preview-wifi.ps1. PC /health remains healthy. User confirmed phone /health shows ok and database connected after repair; native app behavior still needs device testing. No APK rebuild.



Phone installation verified September30 via ADB on the single connected OnePlus6T, serial70cbe86a. Package com.mrmcgrain.recoverymeetingfinder version1.0.0/code1 installed successfully and MainActivity launched statusok; process31944 observed. Search/map device testing next. Wi-Fi API192.168.0.35:8081 previously confirmed by user.


## GitHub upload
Repository https://github.com/mrmcgrain/NextChapterAssignments.git branch main, project ReEntryApp/meetAggergator. Local secrets, dependencies, APKs and generated archives excluded.

GitHub application snapshot b7fd1f2 pushed and remote SHA verified September 30. Typecheck/lint passed; 44 tests passed, seven database integration tests skipped.
