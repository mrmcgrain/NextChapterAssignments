# Verification

Verified September 29, 2026 on Windows with Node 26.8.1 and npm 12.0.2.

- Docker PostGIS healthy; development schema and isolated recovery_test schema migrated.
- Four official source feeds fetched and imported into development: AA 1,891, NA 112, CMA 73, MA 4; total 2,080 active listings, confirmed by live /api/v1/sources.
- NA and AA refreshes preserve stable source identities on repeat imports.
- npm run test:postgis: 23 tests passed across six files, including three real PostGIS integration tests; no skipped tests.
- npm run typecheck and client lint passed.
- Rebuilt web export passed to apps/client/dist-verified.
- Live /health returned HTTP 200 with database connected; /api/v1/sources returned source freshness and counts.
- Playwright submitted Mesa + AA, observed real results and opened Arbor Group details with address, schedule, source and last sync time.
- Earlier Expo Doctor passed 21/21; combined web/iOS/Android bundle export passed. Signed builds and native device execution remain unverified.

Current preview: http://127.0.0.1:8081; API http://localhost:3001. Earlier database-disconnected checks in conversation history are superseded.

13 moderate dependency audit findings remain in Expo chains. Review before release; avoid forced incompatible Expo/Router downgrades. Production deployment, source redistribution permission, geocoding/maps and AI interpretation remain pending.

Tucson update September 29: user-authorized missing-timezone fallback imported 520 listings; total 2,600. 26 tests passed including PostGIS, typecheck/lint/web export passed. Detail UI includes per-record assumption footnote; explicit source timezones unchanged.
