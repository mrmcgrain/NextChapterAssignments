# Conversation log

Persistent project logging begins here. This is not a reconstruction of previous development history.

## 2026-09-29

### User Request

Prepare to work on a recovery meeting aggregator module within a larger project. Keep future authentication and user-profile greetings in mind. Review the attached planning conversation ahead of the PRD.

### Codex Response

The existing workspace was empty and had no Git repository or project logs. The supplied attachment confirmed Arizona MVP geography, nationwide expansion, broad program coverage, anonymous search, explicit check-ins, web/mobile support, and optional/manual location search. The attachment ends at the PRD title and does not contain the PRD body.

### Actions

Commands:
- Inspected the workspace, Git status, local instruction presence, and existing project-log presence.
- Read the supplied attachment and captured confirmed decisions.

Files changed:
- docs/confirmed-requirements.md: Recorded supplied decisions and pending requirements.
- logs/project-state.md: Initialized current context from the empty workspace and supplied requirements.
- logs/conversation-log.md: Initialized persistent logging.

Decisions:
- Preserve this existing workspace as the module root.
- Do not invent missing PRD requirements or scaffold an application before reviewing the forthcoming PRD.

Errors/Fixes:
- Git status reported that the folder is not a Git repository. No Git initialization was requested or performed.
- The PRD body is missing from the attachment. This remains unresolved.
- Verified documentation creation and reviewed the content for secrets. No credentials were recorded.

### Next Steps

- Receive the complete PRD and review it against the captured decisions before implementation.

## 2026-09-29 13:08

### User Request

Provided the ChatGPT project link for NC - reentry roadmap as project context.

### Codex Response

Confirmed the matching ChatGPT project through Codex app access. Found Meeting Data Aggregator, Recovery Module Design, and Reentry App Sections. Read Meeting Data Aggregator and Recovery Module Design. The latter contains recovery-module ideas and a user request for a Days Free counter, but no full Module 001 PRD was recovered from those two chats. Earlier assistant recommendations are proposals, not confirmed implementation decisions.

### Actions

Commands:
- Read local project-state and conversation-log documents.
- Opened the supplied URL; public web access redirected to login.
- Used list_projects, list_threads, and read_thread to recover authenticated project context.

Files changed:
- logs/conversation-log.md: Recorded project-link discovery and access results.
- logs/project-state.md: Recorded accessible planning chats.

Decisions:
- Keep implementation pending the full PRD; do not promote prior assistant proposals into approved requirements.

Errors/Fixes:
- Corrected tool argument limits when listing and reading chats.
- No credentials were recorded.

### Next Steps

- Review Reentry App Sections if broader platform context is needed.
- Receive or locate the complete Module 001 PRD before implementation.

## 2026-09-29 13:20

### User Request

Provided shared ChatGPT conversation https://chatgpt.com/share/6abc1d58-6ea4-83ea-b30e-f1407a547248.

### Codex Response

The public share resolved to the title Build National Voting Rules Engine but exposed no conversation text. Located and read the accessible chat with that same title in the NextChapter ChatGPT project. Its recent messages discuss voting-rights questions, official state references and next-step links, rights-restoration forms, and possible in-app paperwork submission. This is different from the meeting-aggregator PRD. The accessible same-title chat was used as context; identity with the shared snapshot is not independently established.

### Actions

Commands:
- Opened the shared URL with web access.
- Used list_threads and read_thread to inspect the accessible same-title chat.

Files changed:
- logs/conversation-log.md: Recorded the reference and scope discrepancy.

Decisions:
- Do not merge voting-module proposals into confirmed meeting-aggregator requirements without user direction.
- Historical legal assertions were not independently verified and are not treated as current legal guidance.

Errors/Fixes:
- The share identifier could not be read as a chat identifier; located the same-title chat separately.

### Next Steps

- Clarify whether the voting module is intended as broader platform context or a change in current module scope.
- The complete meeting-aggregator PRD remains outstanding.

## 2026-09-29 16:50

### User Request

Continue autonomously with concise milestone/blocker updates and phone notifications if available. Approved all Arizona meeting sources and delegated discovery.

### Codex Response

Recovered stale project logs and found a working-in-progress monorepo plus full lean MVP PRD. Fixed API validation errors, added focused API tests, implemented the first official Arizona NA adapter and sync CLI, and verified the adapter against the live public feed. Phone notification tool was unavailable.

### Actions

Commands:
- npm run typecheck; npm test; npm run build; Expo client lint.
- Read official Arizona NA directory and its BMLT region-1190 feed; validated normalized records using shared schema.
- docker info; attempted hidden Docker Desktop launch, including outside sandbox. Engine remained unavailable.

Files changed:
- apps/api/src/app.ts: safe error narrowing and shared validation instance.
- packages/shared/src/index.ts: exported Zod instance.
- tests/api.test.ts: six HTTP validation, health, report and authorization tests.
- apps/api/src/sources/arizona-na.ts: published AZ feed normalization without guessing missing timezones.
- apps/api/src/sync-cli.ts and API sync script: explicit adapter invocation against registered approved source.
- tests/arizona-na.test.ts: four adapter contract/invalid-data tests.
- docs/source-approval.md: owner approval and source evidence, registration instructions and unresolved reuse terms.
- logs/project-state.md: replaced outdated documentation-only state with observed code and verification status.

Decisions:
- Owner approval covers source discovery; no repeated source-choice approval needed.
- Missing timezones are skipped rather than inferred. Diagnostic raw fields exclude contact details and admin notes.
- Production redistribution terms require verification before public release.

Errors/Fixes:
- API previously resolved Zod 3 while calling Zod 4 APIs. Shared validation import fixes compile/runtime validation consistency.
- npm dependency fetch failed with EACCES in sandbox. Existing shared Zod was used; no successful install is claimed from that attempt.
- Initial build saw a transient missing json-schema type during changing dependency contents. Subsequent typechecks and web build passed.
- Tests: 12 passed; three PostGIS integration checks explicitly skipped.
- Live source: 477 records, 471 published AZ, 112 valid, 359 skipped for missing timezone.
- Docker engine pipe remained unavailable after launch attempts. No import or database success claimed.
- Reviewed documentation for secrets; none recorded.

### Next Steps

- Start a working Docker engine or supply PostGIS privately; migrate and run integration checks, then import the approved development source.
- Resolve source timezone omissions and production reuse terms.
- Continue remaining official source adapters and MVP stories. Full MVP is not complete.

## 2026-09-29 16:51

### User Request

Start building from the supplied lean MVP PRD and architecture unless a problem prevents it.

### Codex Response

Implemented the first foundation in the existing project root. PRD requires first-source approval; requested that information while continuing independent development. Created Expo finder/detail/report screens, shared validation, Fastify API, PostGIS migrations, transactional sync service and CI. Arizona NA adapter/test/source notes also appeared in the shared workspace during work; inspected and preserved them, without performing source registration or import.

### Actions

Commands:
- Downloaded official Expo SDK 57 template and installed workspace dependencies.
- Ran typecheck, Vitest, Expo lint, web/native exports, Expo Doctor and npm audit.
- Started Expo preview and API; used Playwright at desktop/mobile sizes and verified failed-search handling.
- Inspected Docker and Postgres availability; checked live /health.

Files changed:
- apps/client, apps/api, packages/shared: Application foundation.
- database/migrations, compose.yaml: PostGIS database setup.
- tests, .github/workflows/ci.yml: API/model/integration validation and CI.
- package manifests/lock, environment template, README and verification/source-approval template: Setup and boundaries.
- logs/project-state.md and this log: Current progress and unresolved work.

Decisions:
- Keep accounts/check-ins and other modules outside MVP.
- Use parameterized pg for direct PostGIS queries; removed unused Drizzle.
- Do not expose fictional test data as real listings.
- Leave source activation pending approval evidence and reuse permission reconciliation.

Errors/Fixes:
- Sandbox network restrictions required approved elevation for package downloads.
- Fixed API resolving Zod v3 rather than shared v4 by explicitly declaring the API dependency.
- Restricted Vitest to source test files to avoid compiled duplicate test discovery.
- Resolved lint dependency visibility at workspace root.
- Upgraded Vitest and pinned/deduplicated native animation dependencies; Expo Doctor passed 21/21.
- API tsx startup hit sandbox Windows userInfo ENOMEM; approved elevated launch succeeded.
- Docker engine is unavailable. Database /health returns 503; migration and real integration tests remain unverified.
- Remaining audit: 13 moderate Expo-chain findings, no forced SDK downgrade applied.

### Next Steps

- Start/provide PostGIS, apply migrations, and run skipped integration tests.
- Confirm first-source activation/reuse terms, then verify a real meeting from import through client detail.
- Continue location/maps/filter UX, scheduling, AI and release work described in project-state.
`nFinal verification: Combined web/iOS/Android export passed after deduplication. The existing other-session log records source-discovery approval; reconciled project-state accordingly. Production reuse terms remain unresolved. Preview opening was queued in Codex. Logs reviewed without credential values.

## 2026-09-29 17:44

### User Request

Preview is not live.

### Codex Response

Verified ports and HTTP responses; in-app browser showed a blank/stalled page. Started a persistent server for the verified web export on 127.0.0.1:8081 and stopped the old Expo development process. API remains database-disconnected.

### Actions

- Added scripts/preview.mjs with SPA routing and local-only binding.
- Started hidden background preview with local runtime logs.
- Checked HTTP 200. Browser reload timed out, so in-app rendered verification remains unresolved.

### Next Steps

- Open http://127.0.0.1:8081/; database setup remains outstanding.

Final preview check: corrected root-route containment check, restarted the background preview, and verified page and JavaScript bundle responses.

## 2026-09-29 17:54

### User Request

Advance autonomously from the saved state.

### Codex Response

Removed the database blocker, migrated local PostGIS, ran the isolated database suite, imported 112 valid official Arizona NA meetings and verified real NA search/detail in the web browser.

### Actions

Commands:
- Elevated docker info, docker compose up, npm run db:migrate.
- Created isolated recovery_test database, migrated it and ran all three PostGIS integration tests successfully.
- Registered owner-approved arizona-na source in development and ran the sync CLI: 112 imported, 359 skipped for missing timezone.
- Typechecked; ran API/model/adapter tests; exercised real browser search and detail using Playwright CLI.

Files changed:
- apps/api/src/app.ts: allow both local preview origins; trim configured origin values.
- tests/api.test.ts: CORS allowed/unrelated-origin regression check.
- Private .env: local CLIENT_ORIGIN configuration only; no values copied to project logs.
- logs/project-state.md and conversation-log.md: database and real-browser milestone.

Decisions:
- Keep fictional integration records in an isolated database.
- Preserve source-provided timezones and skip missing values.
- Keep development services running for review. No public deployment, commit or push.

Errors/Fixes:
- Sandbox Docker access denied; elevated read confirmed working engine.
- Browser initially blocked API due to 127.0.0.1 versus localhost CORS mismatch. Fixed configuration/defaults, restarted identified API process, and verified real results and detail with source attribution.
- Browser verified Biscuits & Gravy, Sunday 08:00 America/Phoenix, Prescott Valley, from Arizona Region of NA.
- Production reuse terms and native-device verification remain unresolved. Documentation contains no credentials.

### Next Steps

- Continue full filter/location/map UX and source coverage; confirm reuse terms before public release.
- Verify real data on native devices and complete release work.

Final validation: all 20 tests passed with TEST_DATABASE_URL targeting isolated recovery_test; no tests skipped.

## 2026-09-29 18:04

### User Request
Approved the UI and requested moving forward with live source APIs.

### Codex Response
Connected four official feeds to the development database, totaling 2,080 stored listings. Verified browser search/detail and live health/source status. Missing source timezones remain excluded.

### Actions
Commands:
- Started Docker Desktop; docker compose up -d database; npm run db:migrate.
- Ran four-source development registration/import and repeated NA/AA refreshes.
- npm run test:postgis: all 23 tests passed, including three real database tests.
- npm run typecheck, client lint and web export passed.
- Restarted project API; verified /health and /api/v1/sources. Playwright Mesa AA search and Arbor Group detail passed.

Files changed:
- Source adapters/registry/sync CLI: AA, CMA and MA integration alongside existing NA.
- Adapter fixture tests and scripts/test-postgis.mjs: source/privacy rules and isolated database verification.
- API repository/routes: public source counts and freshness endpoint.
- Client finder: MA filter; environment template: both local preview origins.
- README and source/verification/project-state docs: current setup, real coverage and unresolved limits.

Decisions:
- Keep imports within development until redistribution terms are established.
- Use explicit source timezone; defer Tucson AA rather than guess.
- Discover MA cache dynamically; preserve existing records on partial imports.

Errors/Fixes:
- Local preview CORS required localhost and 127.0.0.1 origins; verified live header and successful browser API requests.
- Redundant API start encountered occupied port; identified and restarted the existing project process.

### Next Steps
- Remaining source adapters, refresh scheduling, geocoding/maps, AI interpretation and native verification.
- Confirm source redistribution terms and review remaining Expo dependency advisories before release.

## 2026-09-29 19:08

### User Request
Assume Tucson uses Mountain Standard Time and add a footnote.

### Codex Response
Added Tucson AA adapter using America/Phoenix only for missing timezone values. Imported 520 listings. Stored assumption provenance and displayed a footnote beneath the detail schedule.

### Actions
Commands:
- Tucson development registration/import: 520 imported, zero invalid normalized records skipped.
- Typecheck, client lint and web export passed. Full isolated PostGIS suite: 26 passed.
- Restarted project API to expose timezoneAssumptionNote.
Files changed:
- Tucson adapter, source registry, repository projection, shared Meeting type, detail footnote, three adapter tests.
- Source approval and project-state documentation.
Decisions:
- Scope fallback to Tucson feed, preserve explicit source timezones, retain assumption provenance per record.
Errors/Fixes:
- Sandboxed tsx failed Windows user-info lookup with ENOMEM; approved unsandboxed retry passed tests and import.

### Next Steps
- Remaining source integrations, scheduled refresh, geocoding/maps, AI and native verification remain pending.

## 2026-09-29 19:15

### User Request
Host the app so it can be viewed.

### Codex Response
Confirmed the existing local preview returns HTTP 200 and API health reports database connected. Opened the preview in the Codex browser panel. This is local hosting on this computer.

### Actions
Commands:
- HTTP checks for http://127.0.0.1:8081/ and http://localhost:3001/health.
- Opened preview with Codex browser panel tool.
Files changed:
- logs/conversation-log.md: recorded runtime verification and preview access.
Decisions:
- Use the running local preview for immediate viewing.
Errors/Fixes:
- None.

### Next Steps
- External hosting remains separate from the current local preview.

## 2026-09-29 19:25

### User Request
App works in Chrome but fails in Codex browser.

### Codex Response
Codex browser inspection timed out at CDP focus command, preventing confirmation of exact rendering failure. Removed cross-port web API dependency by using same-origin requests and forwarding /health and /api/v1/ through the built preview server. Rebuilt and reopened a fresh preview URL. HTTP preview, proxied health and Tucson search verified. Actual Codex browser rendering remains unconfirmed.

### Actions
Files changed:
- apps/client/src/lib/api.ts: web same-origin default; native localhost/API override retained.
- scripts/preview.mjs: stream API requests to localhost3001 with timeout and unavailable response.
Commands:
- Typecheck, client lint and web export passed.
- Restarted verified preview process; HTTP page, proxied health and live search passed.
Decisions:
- Explicit EXPO_PUBLIC_API_URL remains supported for standalone Expo development and hosted/native configuration.
Errors/Fixes:
- Codex browser CDP Emulation.setFocusEmulationEnabled timed out; no root-cause claim made.

### Next Steps
- Confirm Codex browser rendering after reopening the fresh preview.

## 2026-09-29 Tempe Monday NA diagnostic

### User Request
Investigate why no Monday NA meetings appear in Tempe.

### Codex Response
Live BMLT feed contains Staying Clean for Dummies at 09:30 and Home Sweet Home at 17:30, both at Community Christian Church in Tempe. Both have empty time_zone, so strict NA validation skips them. Local meeting API currently returns service unavailable; Docker Linux engine pipe is absent. No source changes or inferred timezone imports performed.

### Actions
Commands:
- Read NA adapter/tests and source-specific Tucson timezone decision.
- Queried live official BMLT feed and local meeting API; checked Docker status.
Files changed:
- logs/prompt-log.md initialized for available exact transcript.
- logs/project-state.md updated with current service failure and confirmed missing records.
Decisions:
- Preserve explicitly scoped Tucson timezone authorization; propose Tempe fallback with existing footnote mechanism.
Errors/Fixes:
- Sandbox blocked outbound feed socket; escalated read succeeded.
- Database service unavailable, unresolved.

### Next Steps
- Decide Tempe America/Phoenix fallback, add regression coverage and refresh NA.
- Restore database service and verify live search.

## 2026-09-29 22:17

### User Request
Show a JSON hit from each source and how it is stored in the database.

### Codex Response
Fetched real examples from all five official feeds and passed them through current adapters. Saved source excerpts and mapped database fields in docs/source-json-examples.md. Database reads unavailable because Docker engine is stopped and Docker Desktop launch did not remain running. No actual stored-row claim made.

### Actions
- Added scripts/source-examples.ts, executed successfully for five feeds with validated adapter mappings.
- Inspected SQL schema and sync upsert implementation.
- Attempted Docker startup; engine remained unavailable.
- Added source example document, changelog and prompt log.
- Applied newly required project-records skill; prior exact transcript history is incomplete and labeled.

### Next Steps
- Restore Docker/PostGIS and rerun the example script for actual stored rows.
- Internal Codex browser repair remains interrupted and unresolved.

## 2026-09-29 source expansion research
### User Request
Assess proposed AA TSML, NA Tomato/BMLT, Recovery Dharma and local fellowship sources for more meeting data.
### Codex Response
Validated source families and identified unsupported coverage claims. Recommended Recovery Dharma and Arizona AA next, followed by NA coverage comparison and other fellowships.
### Actions
- Inspected current source registry and project state; checked official web documentation/directories.
- Updated project records only. No adapters, dependencies, imports or runtime changes.
- Recovery Dharma JSON contract, AA feed inventory and production reuse terms remain unresolved.
- Earlier Tempe prompt-log entry remains in progress; no unavailable final response fabricated.
### Next Steps
- Validate Recovery Dharma feed and timezone fields; inventory Arizona AA feeds; compare NA upstream identifiers.
- Mirror records to documented Obsidian destination when filesystem access permits.

## 2026-09-29 Tempe NA fix

### User Request
Apply Tempe timezone fallback; explain why location cannot resolve timezone automatically.

### Codex Response
Applied approved Tempe AZ America/Phoenix fallback with assumption footnote; explicit timezones preserved. Imported 125 NA records, skipped 346. Proxied live search returns both Monday meetings and details expose footnotes. City/state/country mappings can support timezone resolution, while ambiguous names and regional daylight-saving rules need disambiguation.

### Actions
Commands:
- docker compose up -d database; targeted arizona-na refresh; npm run test:postgis.
- npm run typecheck; client lint; preview health/search/detail checks.
Files changed:
- apps/api/src/sources/arizona-na.ts: scoped timezone fallback and provenance.
- tests/arizona-na.test.ts: three regression cases covering fallback, explicit timezone preservation, invalid timezone and location/coordinate boundaries.
- docs/source-approval.md, CHANGELOG.md and project records.
Decisions:
- Apply fallback to approved Tempe AZ records only; use existing client footnote support.
Errors/Fixes:
- Initial sandbox-only API CORS test timed out; complete escalated suite passed all 29 tests including real database tests.
- Docker was available on recheck; started project database and restored absent API/preview with hidden Node processes. Live health connected.

### Next Steps
- General geographic timezone resolver remains future work; 346 NA records still skipped.

## 2026-09-29 ZIP meeting search

### User Request
Allow a ZIP code in meeting search and recognize its city.

### Codex Response
Added server-side ZIP resolution and city-based search in both regular and upcoming search flows. City confirmation appears above the location field. Existing city and device-location searches remain supported.

### Actions
Commands:
- npm run typecheck; npm test; npm run lint --workspace @recovery/client.
- npm run build --workspace @recovery/client -- --output-dir dist-verified.
- Live API and preview proxy ZIP lookup returned 85281 / Tempe / AZ; live Tempe meeting search returned 50 listings.
Files changed:
- apps/api/src/zip.ts: validated provider lookup with timeout.
- apps/api/src/app.ts: Arizona ZIP location endpoint and actionable errors.
- apps/client/src/app/index.tsx: ZIP input detection, resolved city query and visible confirmation.
- tests/zip.test.ts: ZIP+4, malformed ZIP, unknown/out-of-state and provider failure coverage.
- CHANGELOG.md and project records.
Decisions:
- Resolve ZIP on search submission; search the resolved city. Provider receives only the five-digit ZIP; no meeting filters are sent to it.
Errors/Fixes:
- Initial test reused an already-consumed Response. Changed mock to return a fresh Response per call. 30 tests passed, 3 database integration tests skipped. Typecheck and lint passed.
- Direct PowerShell provider call hit a socket restriction; running application lookup succeeded.
- Codex browser preview failed with net::ERR_BLOCKED_BY_CLIENT; visual UI verification unavailable.

### Next Steps
- Street-address lookup remains pending.

## 2026-09-29 22:47
### User Request
Docker Desktop crashed after restart.
### Codex Response
Current Docker recovered: PostGIS healthy, API connected, five-source database reads verified. Earlier backend exit cause unknown. Source JSON document refreshed with actual rows. No reinstall performed.
### Actions
Checked Docker, health and five-source script. Updated example document and project records.
### Next Steps
Investigate if crash recurs; internal Codex browser remains unresolved.

## 2026-09-29 Filter breadcrumbs
### User Request
Add breadcrumbs and grouped meeting filters from the supplied list.
### Codex Response
Added removable selection chips, live counts, clear-all, grouped source-backed options and synchronized newcomer/wheelchair shortcuts. Unmapped source options are disabled and labeled unavailable. Search sends selected characteristics to existing API; all selected tags are required.
### Actions
- Added apps/client/src/components/meeting-filters.tsx; updated finder index.tsx and rebuilt dist-verified.
- npm run typecheck, client lint and Expo web export passed.
- Browser verified selecting three tags, removing one breadcrumb and clearing all. Alias shortcuts synchronized.
- No commits or pushes.
### Next Steps
- Extend source normalization before enabling currently unavailable options.

## 2026-09-30 Recovery Dharma validation
### User Request
Confirmed proceeding with the proposed source priority.
### Codex Response
Validated official JSON feed and existing normalization. Identified source quality issues before importing.
### Actions
- Read-only Node fetch and tsx normalization/schema validation: HTTP 200, 955 worldwide, 22 Arizona, 22 schema-valid; 17 in-person and 5 online.
- Sandbox fetch failed; approved escalated public read succeeded. No application changes or database writes.
- Created docs/recovery-dharma-validation.md; updated records and changelog.
- Found Mesa Sunday conflicting 09:00 structured time versus 08:00 name; two possible online duplicate pairs; RD-specific type codes require mapping.
### Next Steps
- Implement source-specific adapter and schedule conflict handling; review duplicate candidates and production reuse terms.

## 2026-09-30 08:00
### User Request
Host it up to see the app.
### Codex Response
Started local preview and API, restored database container, requested Codex browser panel. Verified page HTTP 200, health database connected, meeting search HTTP 200 and five sources totaling 2,613 stored listings.
### Actions
- docker compose up -d database; hidden Node preview and API processes.
- API sandbox user lookup failed with uv_os_get_passwd ENOMEM; elevated local startup succeeded.
- Updated project records. No application source changes.
### Next Steps
- Public deployment remains gated on source reuse terms.


## 2026-09-30 08:05
### User Request
Support selecting multiple breadcrumb filters at a time.
### Codex Response
Changed program, format and day selections to arrays with additive toggles and independent breadcrumb removal. Existing characteristic multi-selection preserved.
### Actions
Commands: npm run typecheck; client lint; npm run test:postgis; Expo web export to dist-verified.
Files changed: client finder, shared search schema, API repository, API and PostGIS tests, changelog and project records.
Decisions: ANY within program/format/day groups, ALL characteristics. Preserve legacy single-day queries and upcoming behavior.
Errors/Fixes: sandbox user lookup ENOMEM resolved by elevated test execution; corrected new test assertion for existing single-argument search call. All 35 tests passed, typecheck/lint/export passed. Browser/native interaction not verified.
### Next Steps
- Verify multi-selection in browser/native interaction when available.
- Resolve existing Obsidian prompt-log conflict before mirror sync.

## 2026-09-30 Failure tracking

### User Request
Track failures and required changes in this project's Obsidian notes, starting with missing timezone and how it was fixed.

### Codex Response
Documented verified source behavior and historical fix evidence. Missing timezone caused import rejection; Tempe NA uses America/Phoenix with provenance. Map rendering itself was not independently verified.

### Actions
- Inspected adapter, regression tests, API/UI footnote path and prior project transcript.
- Created docs/failures-and-changes.md; updated project state and changelog.
- No application code or runtime changes.

### Next Steps
- Continue appending discovered failures and owner corrections. General timezone resolver remains pending.


- Obsidian failure note copied and SHA-256 verified. Standard four-record sync refused external prompt-log edits; preserved destination. No secrets included.


## 2026-09-30 09:14
### User Request
Log meetings missing from search display despite potentially matching the search, including missing timezone and other blockers.
### Codex Response
Added per-search browser console diagnostics with exact limit omissions, field-specific validation rejections, missing-coordinate candidates and source sync coverage status. Invalid candidates are labeled uncertain; retained prior listings are flagged.
### Actions
Commands:
- npm run db:migrate; npm run sync --workspace @recovery/api -- all. Initial sandbox tsx uv_os_get_passwd ENOMEM resolved by approved elevated execution.
- npm run typecheck; client lint; npm test; npm run test:postgis; Expo web export to dist-verified.
- Verified project API process identity and restarted it. Live proxied Mesa/Tempe diagnostics and Mesa normal search verified.
Files changed:
- database/migrations/002_search_diagnostics.sql and API migrate.ts: add nullable rejected-meeting snapshot.
- API sync.ts: persist public allowlisted rejected records and validation reasons.
- API search-diagnostics.ts, repository.ts, app.ts: candidate filters, unlimited diagnostic matching, diagnostic endpoint.
- Client index.tsx: log each search's diagnostic response and errors without blocking results.
- tests/search-diagnostics.test.ts and integration.test.ts: matching and persistent real-database diagnostics checks.
- CHANGELOG.md, docs/failures-and-changes.md and project records updated.
Decisions:
- Keep default display cap at 50; expose all matching omissions in console. Missing data candidates do not claim confirmed matches. No new timezone fallback.
Verification:
- 38 tests passed including five real PostGIS tests; typecheck and lint passed; web export passed.
- Mesa 280 matches, 230 limit omissions, 55 rejected candidates. Normal API returns 50 listings.
### Next Steps
- Resolve general timezone data gaps and decide pagination/full-list UX.
- Adapter-level exclusions and unconnected source coverage remain outside record enumeration.
- Verify browser console interaction; local API/payload and web bundle verified.

## 2026-09-30 search-cap clarification
### User Request
Explain the limit that omitted 230 meetings.
### Codex Response
Verified repository.ts default search limit 50 and shared API maximum 100. Finder has no pagination. Mesa diagnostic total 280 means 230 valid matches omitted by the cap. Cap was pre-existing and left unchanged by diagnostics work. Recommend pagination/load more for full area access.
### Actions
- Read current repository limit and project state. No application changes.
### Next Steps
- Add pagination/full-list access when requested. Existing Obsidian transcript conflict remains unresolved.

## 2026-09-30 | Find a Meeting Now scrolling
### User Request
Scroll to listings when clicking Find a Meeting Now.
### Codex Response
Added animated scrolling to the results section after upcoming search completes, including errors and empty results.
### Actions
- Changed apps/client/src/app/index.tsx to measure results position and scroll after rendering.
- Typecheck, client lint and Expo web export to dist-verified passed. Browser/native interaction not verified.
- Updated CHANGELOG.md and project records. Existing Obsidian transcript conflict remains pending.
### Next Steps
- Resolve existing Obsidian transcript conflict while preserving external edits.

## 2026-09-30 Load more implementation
### User Request
Add Load more with a note that only 50 listings can be received at a time.
### Codex Response
Added incremental pagination, 50-listing explanatory note, loaded count and final-page state. Original submitted filters stay fixed until a new search. Failed page loads preserve cards and can be retried.
### Actions
Commands:
- npm run typecheck; client lint; npm run test:postgis; Expo web export to dist-verified.
- Identified local API process and restarted it; verified current preview in browser.
Files changed:
- packages/shared/src/index.ts: validated offset and asOf.
- apps/api/src/repository.ts and app.ts: paginated regular/upcoming results, next-page metadata, frozen upcoming reference time and cumulative diagnostics.
- apps/client/src/app/index.tsx: Load more state, saved query, append/error behavior and user note. Preserved pre-existing scroll-to-results changes found at startup.
- tests/api.test.ts and integration.test.ts: validation, metadata, all-page retrieval without duplicates.
- CHANGELOG.md and project records.
Verification:
- 40 tests including six PostGIS tests passed; typecheck/lint/export passed.
- Browser Mesa reached all 280 cards in six batches, removed button at exhaustion; changed city input did not alter submitted pagination filters.
Decisions:
- Display 50 per request and preserve existing cards during subsequent loads. Offset paging uses stable ordering; source changes mid-search may shift pages.
### Next Steps
- Native interaction remains unverified. Existing Obsidian transcript conflict remains unresolved.

## 2026-09-30 mandatory-field explanation
### User Request
Explain mandatory fields behind rejected candidate diagnostic message.
### Codex Response
Shared schema requires sourceMeetingId, fellowship, name, dayOfWeek, startTime, timezone, format and state. Live Mesa diagnostics had 55 rejected candidates, all missing timezone. Optional fields can still reject when malformed. Generic certainty label is separate from specific reasons.
### Actions
Inspected shared schema, sync, repository, NA adapter and candidate matching; queried running diagnostics API. No application changes.
### Next Steps
- Existing Obsidian prompt-log conflict remains pending.

## 2026-09-30 Recovery Dharma filters and import
### User Request
if we have them on the pull update the filter and options to include
### Codex Response
Implemented source-specific RD mappings, English filter and broad book-study label; registered local source and imported 21 listings with one schedule-conflict rejection.
### Actions
- Inspected current records, client instructions and official RD filter definitions; verified SDK 57 documentation.
- Added RD adapter/registry and three semantic regression tests; extended TSML normalization with source-specific type map; updated finder filter labels/options.
- npm run typecheck and client lint passed; npm run test:postgis passed 43 tests; web exported to dist-verified; sync recovery-dharma --register-development imported 21/skipped 1.
- Live preview API confirmed filtered RD results: book study 1, LGBTQIA+ 1, English 20, discussion 0.
- Fixed JSX unescaped apostrophe lint error. Sandbox tsx Windows user lookup failed with ENOMEM; approved test execution outside sandbox passed.
- No Git repository present. No commit or push. Browser/native interaction unverified.
### Next Steps
- Confirm Mesa Sunday schedule and potential online duplicates with source; clarify production reuse permission.
- Obsidian prompt-log external edit conflict remains pending; preserve existing mirror.

## 2026-09-30 10:29
### User Request
Explain unavailable greyed-out breadcrumb filters.
### Codex Response
Verified selectors use empty values to disable unsupported labels. Availability is hardcoded, not computed from selected city results. Full Accessibility lacks bathroom mapping. Suggested hiding unsupported options or grouping them separately; no application changes.
### Actions
Inspected meeting-filters.tsx, AA/NA/RD mappings, local instructions and project state. Updated local records. Existing Obsidian prompt-log conflict remains pending; preserve mirror edits.
### Next Steps
- Await an explicit UI change request; unsupported tag mapping remains future work.

## 2026-09-30 | Sobriety.tools API assessment

### User Request
Assess whether an existing sobriety.tools API key helps our overlapping meeting finder.

### Codex Response
Recommended evaluating as a supplemental meeting source and coverage comparison before replacing direct adapters. Published coverage and limits may reduce integration work; actual Arizona results and approved reuse scope remain unverified.

### Actions
Commands: inspected project state, README and source registry; reviewed developer page and terms through web tools. Git status reported no repository at current root.
Files changed: project-state, conversation-log and prompt-log only.
Decisions: no application changes or imports; obtain API endpoint/auth instructions, test Arizona coverage, validate timezones/IDs/attribution/pagination and deduplication. Developer page refresh descriptions conflict and upsert-only retention requires cancellation review. No secrets read or recorded.
Errors/Fixes: linked GitHub issues returned 404. Existing Obsidian prompt-log conflict preserved; synchronization pending.

### Next Steps
- Use approved access instructions for a small authenticated Arizona comparison.
- Confirm permitted app display, caching and redistribution.

## 2026-09-30 | Record sync conflict explanation

### User Request
Explain the message about local records and the Obsidian prompt-log conflict.

### Codex Response
Local records remain saved. Verified Obsidian prompt-log SHA-256 differs from its last-sync manifest fingerprint. Helper protects potential external edits; origin of divergence unknown. No app failure implied.

### Actions
Commands: read project records skill, project state, sync helper conflict checks, mirror manifest and prompt-log metadata; computed mirror SHA-256.
Files changed: local prompt-log and conversation-log.
Decisions: preserve mirror; explain conflict without replacing either transcript.
Errors/Fixes: synchronization remains pending, no resolution attempted in this explanation turn.

### Next Steps
- Compare both transcripts and preserve unique entries before restoring mirror synchronization.

## 2026-09-30 11:00
### User Request
Add a map showing all meetings matching searched criteria, inspired by sobriety.tools/meetings; continue after interruption.
### Codex Response
Implemented map above results with all matching physical meetings, grouped dots, schedule popups/detail navigation and counts for online/missing coordinates.
### Actions
- Changed API app route, finder, new map-html and platform map components, client package/lock and API regression test.
- Commands: Expo install react-native-webview; typecheck; client lint; npm test; Expo web export; restored API/preview.
- Verified 38 tests passed, 6 skipped; typecheck/lint/export passed. Live browser Mesa AA 278 matches, 277 mapped across 32 dots, popup/detail navigation passed.
- Restricted dependency network and API runner failed; approved escalation succeeded. No commit/push.
### Next Steps
- Verify native devices. Resolve Obsidian externally edited prompt-log conflict before mirror sync.

## 2026-09-30 11:00 -07:00
### User Request
Remove the visual display of unavailable greyed-out filter options.
### Codex Response
Removed unsupported controls from the meeting-filter screen while retaining supported selectors, shortcuts and selected breadcrumbs. Typecheck, lint and web export passed. Browser and native interaction not rechecked.
### Actions
Commands:
- npm run typecheck --workspace @recovery/client
- npm run lint --workspace @recovery/client
- npx expo export --platform web --output-dir dist-verified
Files changed:
- apps/client/src/components/meeting-filters.tsx: removed disabled unavailable controls and explanatory text.
- CHANGELOG.md: noted UI change.
- logs/project-state.md: updated current filter behavior.
Decisions:
- Hide unsupported options until source mappings exist.
Errors/Fixes:
- None.
### Next Steps
- Add source-backed mappings only after validating their meaning.

## 2026-09-30 | Sobriety.tools preliminary comparison

### User Request
Test overlap, smaller or larger coverage; owner supplied key-file path and asked to continue.

### Codex Response
Collected public API results and compared to 2,634 live local schedule listings. Found 2,577 AZ-labelled remote listings and 2,095 confident one-to-one AA matches; unmatched 539 local/482 remote, 317 uncertain candidate pairs. Remote sample adds SMART 14 and Wellbriety 22 listing IDs. Collection incomplete and unmatched does not establish unique new meetings.

### Actions
Commands: live read-only PostgreSQL SELECT; inspected public Next.js client and developer access-form service URL; GET /v1/meetings probes; node scripts/compare-sobriety.mjs; matching self-check and node --check passed.
Files changed: scripts/compare-sobriety.mjs, docs/sobriety-comparison.md, output/sobriety-comparison/report.json, CHANGELOG.md and project records.
Decisions: no imports, source refreshes, database mutations or app behavior changes. Keep key in owner-provided Obsidian note; never copy to records. Store allowlisted public evidence only.
Errors/Fixes: initial shell network blocked, elevated read-only fetching succeeded. Initial X-API-Key calls used public quota; corrected earlier claim of accepted authenticated key after bearer returned 401 API key is pending approval. Public quota reached 429 during Saturday; Sunday LifeRing returned 500. Collector now uses bearer by default, explicit --public mode, stops new calls at 429, checkpoints allowlisted rows and accepts Arizona state alias. Original run lost excluded raw rows; report honestly records that limitation. Invalid replacement patch corrected with direct document write.
Quality: remote sample missing timezone/source for all rows and city for 2,553; 389 fetched IDs missing state excluded; 31 remote/14 local extra exact-fingerprint duplicate candidates require review. No deletions performed.

### Next Steps
- Complete comparison after provider approves key or public quota becomes available.
- Review missing-state rows, uncertain matches, duplicate candidates and published schedules.
- Validate timezone/attribution and reuse contract before importing.
- Obsidian record synchronization remains pending existing prompt-log conflict.

## 2026-09-30 | OpenStreetMap error investigation
### User Request
Explain OpenStreetMap error so it can be fixed.
### Codex Response
Observed OSM 403 access-blocked images; network confirmed empty Referer on tile requests. OSM requires valid web Referer. Inline sandboxed about:srcdoc implementation likely cause. Proposed proper served map document with valid identification/cache/attribution; no application change this turn.
### Actions
- Inspected map source, screenshot, console and child-frame CDP request headers. Checked official OSM tile policy and blocked-tile guidance.
- Meeting results/dots remain available; blank Referer confirmed during single zoom. No secret data captured in records.
- Created partial-coverage daily/weekly recap and transcript index under new owner instructions.
### Next Steps
- Implement and verify served web map/referrer fix; native identification separately. Existing Obsidian prompt-log conflict remains.

## 2026-09-30 | Map account requirements
### User Request
Ask whether an account/API key is required and whether missing setup caused the error.
### Codex Response
Official OSM standard tile policy checked. No account/key needed for current interactive service; identification, attribution and caching required. Account signup would not fix confirmed empty Referer. No application changes.
### Actions
Read official tile policy and current records; updated transcript and daily/weekly summaries.
### Next Steps
Repair map request identification; existing standard Obsidian transcript conflict pending.

## 2026-09-30 | OpenStreetMap web repair
### User Request
Try the proposed map fix and verify the result.
### Codex Response
Web map now renders bundled Leaflet directly in page. Real street tiles and correct Referer confirmed; matching dots, popup schedules and detail navigation preserved.
### Actions
- Files changed: apps/client/src/components/meeting-map.web.tsx, src/leaflet-css.d.ts, apps/client/package.json, package-lock.json, dist-verified export, CHANGELOG.md, project records/recaps. Proof logs/map-referrer-fixed.png.
- Commands: Expo install leaflet/@types/leaflet; root typecheck; client lint; Expo export.
- Attempts: served sandboxed map page and referrer-policy variant both retained blank Referer. Temporary HTML removed; selected direct DOM map with no frame. Default strict-origin policy retained; no browser/security settings changed.
- Initial typecheck lacked CSS module declaration; added exact declaration. Lint rejected synchronous effect setState; reset moved into asynchronous map load callback. Final checks passed.
- Live request header Referer http://127.0.0.1:8081/ confirmed. Street-map screenshot verified. Mesa AA 277 mapped/278 matches; 32 grouped dots; 54 popup schedules at first dot and details path verified.
- Existing browser tab timed out; fresh verification tab worked. No native claims or new tests for UI-only repair.
### Next Steps
- Native device/request identification verification. Existing Obsidian transcript conflict unresolved.

## 2026-09-30 12:40
### User Request
Show Wild Bunch NA JSON and compare another meeting; investigate two-result count.
### Codex Response
Live source has three Wild Bunch schedules. Only Monday has explicit timezone and is stored; Sunday/Tuesday rejected for null timezone. Tempe comparator imports using existing city fallback. Live Tempe NA Monday returns two; Phoenix NA all days six. Current screen filters unknown.
### Actions
Read adapter/schema and fetched public feed and local API. Saved allowlisted source fields and rejection JSON under logs/wild-bunch-*.json. Initial restricted socket request failed; elevated read succeeded. API rejected limit 200; corrected to supported 100. No application edits.
### Next Steps
Extend timezone resolution to confirmed Phoenix AZ if requested. Existing Obsidian transcript conflict remains pending.

## 2026-09-30 | Timezone repeated-fix documentation

### User Request
Add the repeated timezone fix to failures; resolution must apply on every query and reuse previously found data rather than repeatedly call an API.

### Codex Response
Recorded the one-off patch failure, universal processing requirement and reusable-resolution requirement. Inspected shared offline resolver; caching and live rollout remain unverified.

### Actions
Files changed: docs/failures-and-changes.md, TimezoneFix.md and project records/recaps. Inspected timezone.ts and existing records. No application code changed. Git status failed because this workspace currently has no Git repository metadata. No commit attempted.

### Next Steps
- Verify/implement saved-location reuse and refreshed runtime results.
- Resolve existing Obsidian transcript conflict before claiming full sync.

## 2026-09-30 | Exact Obsidian failure note update
### User Request
Update the specified Obsidian Failures and required changes.md.
### Codex Response
Updated the note from the canonical project failure register after verifying its existing text was an unchanged prefix. SHA-256 hashes match.
### Actions
Copied docs/failures-and-changes.md to F:\Obsidian\SecondBrain\01-Projects\meetAggergator\Failures and required changes.md using approved access. Preserved existing content; included entries 2 and 3.
### Next Steps
- Existing standard transcript and recap mirror conflicts remain separate and unresolved.

## 2026-09-30 Filters dropdown
### User Request
Hide all filter controls in a Filters dropdown before the breadcrumbs.
### Codex Response
Added a collapsed-by-default accessible Filters disclosure. Contains fellowship, format, day, start time, characteristics and conditional nearby radius. Selected breadcrumbs, removal, clear-all and Search remain outside; selections persist while collapsed.
### Actions
- Modified apps/client/src/app/index.tsx.
- npm run typecheck and npm run lint --workspace @recovery/client passed.
- npx expo export --platform web --output-dir dist-verified passed.
- Browser CLI attempt did not return usable evidence; browser interaction remains unverified.
- Records and recap sync helpers refused existing external edits to mirror logs/prompt-log.md and dailyprompt.md. Preserved mirror copies.
### Next Steps
- Verify browser/native interaction and reconcile Obsidian mirror conflicts.

## 2026-09-30 13:04
### User Request
Document TimezoneFix.md and implement missing-timezone autofill for every source by city. Persist and reuse resolutions across data refreshes. Keep caching unverified until tested.
### Codex Response
Implemented shared prevalidation resolver, offline city/geographic datasets, provenance, persistent PostgreSQL cache and Map reuse. Removed adapter-specific Tempe/Tucson policies. All NA schedules now import; Wild Bunch all three schedules confirmed.
### Actions
Files: TimezoneFix.md, apps/api/src/timezone.ts, sync.ts, migrate.ts, NA/Tucson adapters, database/migrations/003_timezone_cache.sql, source-examples.ts, scripts/verify-timezone-cache.ts, timezone/adapter/integration tests, API dependencies/lockfile, changelog, failure register and project records.
Commands: npm install city-timezones geo-tz in API workspace; npm run typecheck; client lint; db:migrate; test:postgis; sync:sources; fresh-process cache verification and live API reads.
Verification: all 51 tests passed including seven PostGIS tests; typecheck/lint passed. Six-source refresh total 2,980, NA 471/0 rejected recovering 346; Phoenix AA 1891/2 skipped and RD 21/1 schedule conflict unchanged. Wild Bunch all three schedules returned with repaired provenance on Sunday/Tuesday only. Phoenix NA total 57, no rejection candidates. Fresh process loaded 96 persistent cache entries, zero geographic calls for saved cities, unchanged cache after repeat NA import.
Errors/Fixes: Initial verification script used unsupported top-level await in root CommonJS scope; wrapped async main and reran successfully. A PowerShell test-edit command failed parsing before any writes; used apply_patch instead. No public deployment or commits.
### Next Steps
Handle genuinely unresolved/ambiguous locations through diagnostics; maintain dataset/cache exceptions for future geography. Obsidian record conflict remains pending.

Mirror verification: both approved sync helpers refused existing external edits, in logs/prompt-log.md and dailyprompt.md respectively. Local records and external copies preserved; no synchronization claimed.


## 2026-09-30 13:16:19 -07:00

### User Request
Move G:\23\ReEntryApp into G:\23\nextChapter\NextChapterAssignments and update paths; paused for other agents, then resumed with "Ok go time".

### Codex Response
App contents moved to G:\23\nextChapter\NextChapterAssignments\ReEntryApp\meetAggergator. Three workspace junctions repaired; current location records and Obsidian manifest source roots updated. Original transcripts retain historical paths.

### Actions
- Commands: stopped only the app API/watch/preview processes; same-volume entry renames after locked-parent rename failed; destination inventory enumerated 45,976 regular files excluding junction traversal. Original folder now empty. Long-path prefix corrected inventory failure.
- Files changed: parent .gitignore and project-state; app CHANGELOG.md, project-state, prompt/conversation logs, daily/weekly recaps; folder-migration-verification.json; Obsidian source-root manifests with preserved backups and ownership hashes. No application source files needed literal-path replacement.
- Verification: npm run typecheck passed. API 3001 and preview proxy 8081 health return database connected; preview HTTP 200; proxied Phoenix NA meeting query responds. Git check-ignore confirmed .env, node_modules, web export excluded.
- Errors: WinError 5 prevented renaming parent/removing empty old folder, open handle suspected. Long destination path required Windows extended-path inventory. Standard Obsidian sync helpers refused existing external edits to prompt-log.md and dailyprompt.md. No overwrites, commit or push.

### Next Steps
- Reopen current app folder in Codex; old chats still attach to former path. Remove empty old folders after their handles close.
- Reconcile existing Obsidian transcript and daily-recap conflicts before synchronization.


## 2026-09-30 14:13:22 -07:00 | Project record reconciliation

### User Request
Preserve and compare local/Obsidian conflicts, reconcile unique history, synchronize four records and three recaps, verify SHA-256 equality and maintain exact final transcript. No application code, commit or push.

### Codex Response
Preserved both versions of all seven files and mirror metadata with verified original hashes. Comparison found no unique Obsidian transcript entries, conversation entries or changelog content. Older daily/weekly metadata retained. Older Obsidian project-state assertions are historical and superseded by later local evidence. Both installed sync helpers succeeded before clearing pending sync.

### Actions
- Commands: whoami confirmed nullcorprazer\codexsandboxoffline; installed sync_records.py and sync_recaps.py; independent SHA-256 checks.
- Files: seven managed records/recaps, generated mirror indexes/manifests, local reconciliation scripts and backup evidence. CHANGELOG.md content unchanged; routine record maintenance adds no changelog entry.
- Backup: G:\23\nextChapter\NextChapterAssignments\ReEntryApp\meetAggergator\logs\record-reconciliation\20260930-141010
- Errors/fixes: restricted Python write denied; approved execution succeeded. Initial helpers additionally flagged conversation-log.md/allPrompts.md and generated indexes. Reviewed all seven pairs; generated index text matched exactly after newline decoding. Deliberate replacements were made only after verified backups and concurrent-edit checks.
- Unrelated Obsidian files checked against original hashes and preserved.

### Retired synchronization status text
These are historical statements moved out of current project-state after successful verification, not current blockers.

```text
- Key found in owner-specified Obsidian note. Bearer authentication tested: HTTP 401, API key is pending approval. Earlier X-API-Key requests used public quota. No key copied into project; no adapter or import added.
- Existing Obsidian prompt-log conflict remains unresolved; local records authoritative.
Project records: logs/prompt-log.md begins with current source-example request; earlier exact transcript coverage incomplete. Source examples: docs/source-json-examples.md; script scripts/source-examples.ts can regenerate excerpts and real rows when database is available. Mirror target F:\Obsidian\SecondBrain\01-Projects\meetAggergator. Internal Codex browser repair remains interrupted and unresolved.
- Obsidian record sync pending: F:\Obsidian\SecondBrain\01-Projects\meetAggergator is outside current writable roots. Local records preserved.
September 30 record sync attempted with approved helper: incomplete due to conflict or external edit in F:\Obsidian\SecondBrain\01-Projects\meetAggergator\logs\prompt-log.md. Preserve external edits; local records authoritative; inspect before retrying.
`nObsidian sync pending September 30: helper refused external edit/conflict in F:\Obsidian\SecondBrain\01-Projects\meetAggergator\logs\prompt-log.md. Mirror preserved.
Failure register Obsidian copy verified by SHA-256 September 30. Standard record sync remains pending: helper refused external edits in Obsidian logs/prompt-log.md; existing copy preserved.
Obsidian sync remains pending after this turn: helper refused external edit in F:\Obsidian\SecondBrain\01-Projects\meetAggergator\logs\prompt-log.md; mirror preserved and local records updated.
Find a Meeting Now animates to the listings section once search completes, including empty/error states. Target uses measured layout offsets. Typecheck, lint and dist-verified web rebuild passed. Browser/native interaction not verified. Existing Obsidian prompt-log conflict remains pending.
- Obsidian sync remains pending existing external prompt-log edit conflict.
Recap mirror SHA-256 verification passed September 30 for dailyprompt.md, weeklyprompt.md, allPrompts.md and Recap index.md; canonical transcript mirror remains pending conflict.
Failure register entry 3 documents the repeated repair: earlier city/source patches were one-off fixes. Shared offline resolver is now present in apps/api/src/timezone.ts; saved-resolution reuse is required but not verified. Apply missing-timezone repair on incoming JSON queries, reuse known normalized locations before external API requests, preserve coordinate boundary exceptions and provenance. Ordinary searches use stored meeting timezone. Documentation-only turn; no code or runtime checks. Existing Obsidian transcript conflict remains pending.
Obsidian sync pending for this follow-up: records helper refused external edit in logs/prompt-log.md; recap helper refused external edit in dailyprompt.md. Both mirror copies preserved; local updates are authoritative.
September 30 follow-up: exact Obsidian Failures and required changes.md updated and verified by matching SHA-256 against docs/failures-and-changes.md. Standard record/recap conflicts remain unresolved.
All optional filter controls now live inside a collapsed-by-default Filters disclosure above the selected breadcrumbs. Includes conditional nearby radius. Selections persist when closed; breadcrumbs and Search stay visible. Typecheck, lint and dist-verified export passed. Browser CLI yielded no usable verification; native interaction unverified. Obsidian record and recap sync pending existing externally edited logs/prompt-log.md and dailyprompt.md; copies preserved.
Records mirror pending: existing Obsidian prompt-log external-edit conflict; recap permission failure from prior turn. Local records authoritative.
Latest mirror attempt: approved sync helpers refused external-edit conflicts in Obsidian logs/prompt-log.md and dailyprompt.md. Local records retained, external copies preserved; both record and recap synchronization pending.
- Obsidian records sync remains pending the existing externally edited transcript conflict.
Migration verified 2026-09-30 13:16:19 -07:00: typecheck passed; restarted API/preview at new root, direct/proxied health database connected, preview HTTP 200 and Phoenix NA meeting query responded. Empty old app folder remains locked; reopen new root in Codex and remove old empty folders after handles close. Obsidian manifests now point to current root, with prior metadata backed up; sync still blocked by existing prompt-log.md and dailyprompt.md external-edit conflicts.
```

### Older Obsidian state assertions
Preserved as historical evidence; no new runtime verification claimed.

```text
- Only explicitly Arizona records with valid schedules are imported. User authorized America/Phoenix, year-round MST, for missing Tucson AA timezones; records retain an assumption footnote. Tempe AZ NA records now also use owner-approved America/Phoenix fallback with assumption footnote; other cities remain strict.
- NA import is partial: 346 records skipped; 125 valid listings imported after Tempe fallback.
Five live sources connected: Tucson AA 520; Phoenix AA 1,891; Arizona NA 125; Arizona CMA 73; Arizona MA 4. Last-known total 2,613 active listings after NA refresh; other sources not refreshed this turn. Real web AA search/detail verified.
Finder has grouped characteristic selectors, removable chips, counts and clear-all. Current source tag mappings enable discussion, speaker, Big Book, step study, meditation, audience, wheelchair, attendance and Spanish. Missing mappings are labeled unavailable; Full Accessibility remains disabled until bathroom access is supported. All selected tags use existing API AND matching. Changes require Search meetings to refresh results. Typecheck/lint/web export passed; browser selection/removal/clear-all verified September 29. Obsidian mirror sync verified for this turn.

```

### Next Steps
- None for record synchronization. Existing application TODO items remain outside this task. Earlier unavailable transcript coverage remains partial.


## 2026-09-30 14:30:11 -07:00 | Next unfinished app task
### User Request
Read project state and identify next unfinished app task.
### Codex Response
First outstanding milestone is source expansion. Recorded order puts additional Arizona AA feed inventory after completed Recovery Dharma integration. Scheduled refresh is the next separate implementation task; current refresh is manual.
### Actions
Read state, recent history, source registry, package scripts and approval documentation. Corrected stale Recovery Dharma pending entry in project-state. No app code, commit or push. Prior final response matches persisted transcript. Updated exact transcript and recaps; ran installed mirror helpers with SHA-256 checks.
### Next Steps
- Inventory additional Arizona AA feeds, compare coverage, validate contracts/timezones/stable IDs and reuse before adapters/imports.
- Configure scheduled source refresh after prioritization.

## 2026-09-30 14:32
### User Request
rehost
### Codex Response
Restored local preview from migrated project root. Page and Phoenix search HTTP 200; health database connected. Browser open request queued.
### Actions
- docker compose up -d database; hidden Node preview/API startup from current root.
- Project records and recaps updated. No app source changes.
### Next Steps
- None for local preview.


## 2026-09-30 | Recovery Dharma count
### User Request
How many Recovery Dharma listings came from the API?
### Codex Response
Saved validation shows 22 Arizona records from 955 worldwide; import history confirms 21 imported and one Mesa schedule conflict skipped. No fresh upstream request.
### Actions
Read validation report and import records. Initial restricted transcript append denied; retried with escalation.
### Next Steps
- None for count lookup.

## 20260930-143949 | Sync recurrence repair
### User Request
Thought Obsidian sync was already fixed.
### Codex Response
Earlier fix verified; later line-ending changes invalidated manifest hashes. Every mirror record is a normalized text prefix of local source, no unique mirror content. Preserved both versions in logs\record-reconciliation\20260930-143949; rebaselined manifests only after comparison, reran helpers and independently verified seven hashes. Changing process unknown.
### Actions
Compared bytes/text/manifests; reconciled prior full response transcript; cleared pending state. No application changes.
### Next Steps
- If repeated, identify the process normalizing mirror line endings.

## 2026-09-30 | Android update explanation
### User Request
Explain step by step whether local React Native changes automatically update an installed APK.
### Codex Response
Inspected Expo SDK 57 client app.json, eas.json, package.json and API URL selection. EAS Update is not configured. Explained development refresh, rebuild/reinstall, future OTA setup and API/data updates. Installed APK type unverified. No application changes.
### Actions
Read current project state and official Expo documentation. Typecheck passed. Prompt-log append failed with access denied. Record and recap sync pending.
### Next Steps
Choose and configure Android distribution/update workflow when authorized. Verify actual installed build and reachable API.

## 2026-09-30 | Preview APK build attempt
### User Request
Run EAS Android preview build from apps/client.
### Codex Response
Initial npm fetch denied EACCES by sandbox. Network-enabled npx --yes eas-cli@latest build --platform android --profile preview --non-interactive downloaded CLI, then exited: An Expo user account is required to proceed. No cloud build/APK created, no application configuration changed. User must sign in locally. Existing installed binary identity/signing and reachable API URL need confirmation.
### Actions
Typecheck passed. ESLint initial root invocation lacked config; rerun from apps/client with src --no-cache passed. No code/config changes. Updated project records and recaps. Existing Obsidian recap conflict remains pending.
### Next Steps
User signs in with npx eas-cli@latest login. Continue build setup with correct existing Android package/signing and reachable API URL.

## 2026-09-30 | PowerShell scripts disabled
### User Request
Scripts are disabled while following Expo login/build commands.
### Codex Response
Likely npx.ps1 execution policy issue, exact user error unavailable. Agent shell effective policy RemoteSigned; user shell may differ. Verified C:\Program Files\nodejs\npx.cmd exists and --version succeeds, npm 12.0.2. Provided npx.cmd login/build commands. No policy or app changes.
### Actions
Get-ExecutionPolicy -List; Get-Command npx.cmd; npx.cmd --version. Consulted Microsoft execution policy documentation. Updated records and recaps.
### Next Steps
User runs npx.cmd eas-cli@latest login then preview build. Exact error needed if launcher workaround fails. Recap sync remains pending existing Obsidian conflict.

## 2026-09-30 | Launcher error confirmed
User supplied npx.ps1 PSSecurityException, UnauthorizedAccess. Confirmed launcher cause; supplied npx.cmd login/build and full-path fallback. Earlier npx.cmd --version verification applies. No policy/config changes. Next: user sign-in, then build setup.

## 2026-09-30 | Expo sign-in check
User asked next step. npx.cmd --yes eas-cli@latest whoami exited 1: Not logged in. Instructed terminal login followed by whoami verification. No APK build started or app changes. Next: complete Expo sign-in.

## 2026-09-30 | Android preview APK completed
### User Request
Repair failed EAS Android dependency build, continue after sign-in, and use port 8081.
### Codex Response
Original cloud build failed because client-only archive lacked @recovery/shared and npm lockfile. Repaired workspace archive; replacement build 4aca7623-25a5-4d7b-9a44-08a75d20a8d6 FINISHED successfully. APK uses http://192.168.0.35:8081. PC loopback/Wi-Fi health database connected and meeting request HTTP 200; device testing remains unverified.
### Actions
Commands: EAS build:view/log retrieval; expo install expo-build-properties; EAS archive inspection and npm ci dry-run; typecheck; client eslint without cache; node --check; verified preview listener restart with PREVIEW_HOST=0.0.0.0; corrected wrapper build --non-interactive --no-wait; downloaded successful APK.
Files changed: root .easignore and scripts/build-android-preview.mjs for audited workspace packaging; apps/client/eas.json remote version policy and preview API/local HTTP env; apps/client/app.config.js preview-only cleartext plugin; app.json/package.json/package-lock updated by Expo plugin install; scripts/preview.mjs configurable listener; README and CHANGELOG; failure register; project records and recaps.
Errors/Fixes: first Windows wrapper quoting and allowlist inspection corrected before submission. No lockfile disabled, shared package published or keystore replaced. Native/JS cloud phases passed. Download 99,370,396 bytes; ZIP has AndroidManifest.xml and classes.dex. SHA256 7F85D3EEEBEEC78E5424A7FE4C8D42562914FF6DC1B747AA0CB3DDAAA6BCFE4C.
Record sync: preserved both versions and manifests after checking mirror differences; recurring differences were blank-line/line-ending changes, no unique mirrored content. Final helpers/hash checks run at completion.
### Next Steps
Phone on same Wi-Fi opens /health, installs APK and tests search/location/map. Production requires a reachable hosted HTTPS API. PC DHCP changes require preview endpoint update/rebuild. OTA not configured. No commit, push or app-store submission.

## 2026-09-30 | Phone LAN connection restored
### User Request
Phone cannot reach local preview; confirmed same Wi-Fi and no phone VPN/proxy.
### Codex Response
Identified explicit Node TCP Public firewall block. Scoped UAC administrator repair succeeded, effective rules verified. User confirmed phone /health now shows ok/database connected. No APK rebuild/reinstall needed. Native app search/map testing next.
### Actions
Commands: Get-NetTCPConnection, network/firewall profile and exact filter inspection; PC health request; scoped firewall mutation initially denied without admin; prepared allow-preview-wifi.ps1, launched Windows PowerShell RunAs through UAC with process-only execution policy override; ActiveStore inspection verified only8081/localWi-Fi allow, retained other TCP and UDP blocks, all firewall profiles enabled. Backup logs/firewall-8081-before.json; successful helper status logs/firewall-8081-result.json.
Files changed: scripts/allow-preview-wifi.ps1, README, CHANGELOG, docs/failures-and-changes.md, project records and recaps. No app source, APK, VPN or permanent execution-policy changes.
### Next Steps
User opens installed app and tests meeting search/filters/location/map. PC must stay running for this local testing endpoint.

## 2026-09-30 | APK installation not yet performed
User did not see app on phone and confirmed only opening /health. Clarified health check does not install app; supplied successful EAS APK download and Android installer steps. Local APK still exists. No code/config changes. Next: user downloads/installs APK, confirms App installed and opens Recovery Meeting Finder; native app testing remains unverified.

## 2026-09-30 | Installed Android preview on OnePlus 6T
### User Request
Install APK using ADB because download link could not be transferred to phone.
### Codex Response
Live ADB discovery showed one device, OnePlus 6T ONEPLUS_A6013, serial70cbe86a. Verified APK hash matches successful build; adb install -r returned Success. dumpsys package verifies com.mrmcgrain.recoverymeetingfinder versionName1.0.0/versionCode1. am start -W MainActivity statusok, cold launch280ms; pidof returned31944. Installation and launch verified, native search/map not yet verified.
### Actions
Used known host Android SDK platform-tools adb.exe path, verified live device before mutation. Installed only verified local preview APK, no other package changes or uninstall. Updated project records and recaps; no application source/config changes, commit or push.
### Next Steps
Test meeting search, filters/location/map on installed app using Wi-Fi API192.168.0.35:8081.

## 2026-09-30 GitHub upload
### User Request
Push to GitHub.
### Codex Response
Curated project for existing origin/main, retaining unrelated parent edits and local nested Git metadata.
### Actions
Typecheck passed; 44 tests passed, seven integration tests skipped. Sandbox blocked writes and lint cache; retry authorized operations elevated.
### Next Steps
Commit curated files, push and verify remote SHA.
