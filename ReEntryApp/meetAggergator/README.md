# Recovery Meeting Finder

Arizona-first anonymous meeting search using an Expo client, Fastify API, and PostgreSQL/PostGIS. Implementation follows the lean MVP PRD and architecture in `recovery-meeting-finder-lean-mvp/`.

## Local setup

Requires Node 24 or later and a running Docker engine, or an existing PostgreSQL database with PostGIS.

1. `npm install`
2. Copy `.env.example` to `.env`. Keep it private. Set `DATABASE_URL` for your database.
3. `npm run db:up`
4. `npm run db:migrate`
5. `npm run dev:api`
6. In another terminal, `npm run dev:web`.

For native testing, set `EXPO_PUBLIC_API_URL` in `apps/client/.env` to your PC's reachable LAN address, then use the client's Android/iOS scripts or an EAS development build. Restart Metro after changing client variables. Never put database credentials or internal tokens in any `EXPO_PUBLIC_*` variable.

The API listens on port 3001. Postgres is bound to localhost on 54329. `/health` returns 503 if the database/schema is unavailable. Local HTTP is for development; production requires HTTPS and an explicit client origin.

## Validation

- `npm run typecheck`
- `npm test`
- `npm run build`
- Set `TEST_DATABASE_URL` to a dedicated migrated database to run real PostGIS integration tests. Without it these tests are explicitly skipped.

CI provides a PostGIS service for integration tests. No CI execution is claimed until the workflow runs on a remote repository.

## Current scope

Built: shared validation, migrations, approval-gated source sync/upsert service, search/detail API, timezone-aware upcoming query, correction reports, protected internal report list, and initial Expo finder/detail/report routes.

Source discovery approval is recorded in docs/source-approval.md by another project session. Four live development sources are imported: Phoenix AA (1,891), Arizona NA (112), Arizona CMA (73), and Arizona MA (4), totaling 2,080 listings. GET /api/v1/sources exposes counts and sync status. Production reuse terms remain unresolved. No fictional data is loaded into the application.

Still pending: scheduled refresh deployment, remaining source adapters, address/ZIP geocoding, full map/filter UX, AI interpretation, native device testing, signed builds, release configuration and deployment. AI and map providers are not configured. City search matches source city names exactly, ignoring case; it is not geocoding. Nearby search requires explicit foreground permission and stores coordinates only in screen state.

The source sync function never removes previous records on failure, empty imports, or partial imports. Missing source records are retained until a removal policy is approved. A source-provided meeting identifier is currently required; sources without IDs need a deterministic adapter identity rule.

Internal reports require `Authorization: Bearer <INTERNAL_API_TOKEN>`. An unset token disables access. API request logging is disabled to avoid retaining recovery searches, coordinates, and report free text.


## Source refresh

Run npm run sync --workspace @recovery/api -- all --register-development once after migration, then npm run sync:sources for later refreshes. Registration blocks production while redistribution permission remains unresolved. Run npm run test:postgis to migrate an isolated localhost recovery_test database and execute all tests. See docs/source-approval.md for coverage and exclusions.


The built preview server forwards /health and /api/v1/ to the local API on port3001, allowing same-origin web requests. For the standalone Expo development server, set EXPO_PUBLIC_API_URL=http://localhost:3001 in apps/client/.env; restart Metro after changing it. Native clients still require a reachable API URL.

## Android preview APK
Run from the project root:

```powershell
node scripts/build-android-preview.mjs
```

This wrapper runs EAS from apps/client and explicitly archives the real npm workspace root. It includes package-lock.json and packages/shared; a client-only archive cannot resolve @recovery/shared. Root .easignore limits the upload to mobile source/assets, workspace manifests and the shared package. It excludes secrets, logs, generated builds, node_modules and nested Git directories.

To inspect the upload without building, use `node scripts/build-android-preview.mjs --inspect`. Inspection copies are retained under logs/eas-archive-* and excluded from uploads.

The preview profile uses http://192.168.0.35:8081. Both phone and PC need access to the same Wi-Fi, and the preview/API processes must be running. A changed PC address requires updating the preview profile and rebuilding. Start the preview with PREVIEW_HOST=0.0.0.0 to serve both localhost and the Wi-Fi address on port 8081; default binding remains loopback. No firewall changes are automatic. Open http://192.168.0.35:8081/health on the phone to verify connectivity.

EXPO_ALLOW_LOCAL_HTTP=1 enables Android cleartext traffic for local preview builds through expo-build-properties. Production does not enable this flag and requires a hosted HTTPS API URL. cli.appVersionSource is remote. Keep the existing Expo-managed keystore when replacing installed APKs.


### Phone access and Windows Firewall
September 30 inspection found Wi-Fi uses the Public profile and an explicit Node.js TCP block. Windows explicit block rules override allow rules, so adding an allow rule alone was insufficient. The original TCP block was backed up in logs/firewall-8081-before.json, then narrowed to ports 1-8080 and 8082-65535. UDP remains blocked. RecoveryMeetingFinder-Preview-8081-WiFi allows only Node TCP 8081 on Wi-Fi, local address 192.168.0.35, remote subnet 192.168.0.0/24, Public/Private profiles. All firewall profiles remain enabled.

scripts/allow-preview-wifi.ps1 applies this targeted repair with administrator rights. An ordinary non-admin shell will return Access denied. The original session launched it via Windows UAC with a process-only execution policy override; no permanent PowerShell execution policy change. To reverse the repair in an administrator shell, remove RecoveryMeetingFinder-Preview-8081-WiFi and restore the backed-up Node TCP block's LocalPort to Any. A changed Wi-Fi IP/subnet needs the preview URL and firewall scope updated.
