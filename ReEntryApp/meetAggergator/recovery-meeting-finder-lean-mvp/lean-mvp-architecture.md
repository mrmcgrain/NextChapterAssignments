# Recovery Meeting Finder — Lean MVP Architecture

## 1. Architecture Goal

Build the simplest architecture that can:

- aggregate approved meeting sources;
- store normalized meetings;
- search by location/time/filters;
- run on web, iOS, and Android;
- add natural-language search later;
- grow nationally without requiring a rewrite.

Do **not** build a national-scale data platform before the Arizona MVP proves the need.

## 2. High-Level Architecture

```text
Expo / React Native App
(web + iOS + Android)
          |
          v
Small Node/TypeScript REST API
          |
          v
PostgreSQL + PostGIS
          ^
          |
Simple Scheduled Sync Job
          |
          v
Approved Meeting Sources
```

Optional integrations:

```text
Google/Map Provider
→ map display + user-entered location lookup

AI Provider
→ natural-language text to validated filters
```

## 3. Recommended Stack

### Client

- Expo
- React Native
- TypeScript
- Expo Router
- TanStack Query
- React Hook Form
- Zod
- `react-native-maps` or equivalent universal map abstraction

### Backend

- Node.js
- TypeScript
- Fastify
- Zod
- Drizzle ORM
- PostgreSQL
- PostGIS

### Testing

- Vitest for backend/shared logic
- React Native Testing Library for client components
- Postgres/PostGIS integration tests for geographic search
- Playwright for critical web flow
- native E2E can be added close to store release

## 4. Repository

```text
recovery-meeting-finder/
├── apps/
│   ├── client/
│   └── api/
├── packages/
│   ├── shared/
│   ├── api-client/
│   └── source-adapters/
├── database/
│   ├── schema/
│   └── migrations/
├── docs/
└── tests/
```

Do not split the MVP into many internal packages unless the code actually becomes hard to manage.

## 5. Client

One Expo application supports:

- responsive web;
- iOS;
- Android.

Suggested routes:

```text
/
 /search
 /meetings/:id
 /find-now
 /report/:meetingId
```

Core feature folders:

```text
features/
├── search/
├── meeting-detail/
├── map/
├── location/
├── find-now/
├── ai-search/
└── report/
```

The client never talks directly to PostgreSQL or to meeting-source APIs.

## 6. API

Keep the API small.

Suggested endpoints:

```text
GET  /health

GET  /api/v1/meetings
GET  /api/v1/meetings/:id
GET  /api/v1/meetings/now

POST /api/v1/location/resolve
POST /api/v1/ai-search
POST /api/v1/meetings/:id/report
```

Minimal internal/ops endpoints can be added for:

```text
POST /api/v1/internal/sources/:id/sync
GET  /api/v1/internal/reports
```

These must be protected but do not require a dedicated admin application for MVP.

## 7. Minimal Database Model

### sources

```text
id
name
slug
base_url
enabled
refresh_frequency
last_sync_at
last_sync_status
attribution
notes
```

### meetings

```text
id
source_id
source_meeting_id
fellowship
name
day_of_week
start_time
end_time nullable
timezone
format
venue_name nullable
address nullable
city nullable
state
postal_code nullable
geo_point nullable
online_url nullable
online_notes nullable
characteristics JSONB/text[]
source_updated_at nullable
last_synced_at
active
raw_source_data JSONB nullable
created_at
updated_at
```

Important constraints:

- stable internal UUID;
- unique `(source_id, source_meeting_id)` where source ID exists;
- PostGIS index on `geo_point`;
- indexes for fellowship/day/start time;
- source data never directly becomes AI-generated data.

### meeting_reports

```text
id
meeting_id
reason
note nullable
status
created_at
resolved_at nullable
```

That is enough for the MVP.

Do **not** initially create:

- immutable source-record-version tables;
- provenance graph tables;
- duplicate-candidate tables;
- audit-event infrastructure;
- manual-override framework;
- user/check-in tables.

Add them later only when production behavior proves they are needed.

## 8. Source Adapter Interface

Each source gets a simple adapter.

```ts
interface MeetingSourceAdapter {
  fetch(): Promise<unknown>;
  normalize(data: unknown): Promise<NormalizedMeetingInput[]>;
}
```

The sync process:

```text
fetch
→ validate
→ normalize
→ upsert
→ mark sync status
```

Each adapter gets fixture-based tests.

Codex must not add a production source unless it has been approved.

## 9. Source Refresh

For MVP, use **one simple scheduled command/job**.

Example:

```text
npm run sync:sources
```

The hosting platform can call it daily or weekly.

The command:

1. loads enabled sources;
2. syncs each one independently;
3. records `last_sync_at` and status;
4. continues if one source fails.

No queue architecture is needed initially.

If source syncs later become slow or numerous, introduce a queue/worker then.

## 10. Basic Duplicate Strategy

Start simple.

### Strong identity

If a source provides an ID:

```text
source + source meeting ID
→ same source record
```

### Cross-source duplicates

For MVP, use a conservative match on obvious combinations such as:

```text
same fellowship
+ same day
+ same start time
+ same/similar address
```

Do not automatically merge uncertain records.

It is acceptable for the first MVP to occasionally show a duplicate rather than build a complicated matching engine that risks combining different meetings.

## 11. Search

All search runs against PostgreSQL.

### Geographic search

Use PostGIS for:

- radius;
- distance;
- sort by distance.

Do not download all meetings and calculate distance in JavaScript.

### Filter behavior

- fellowships: OR
- formats: OR
- characteristics: preferably AND unless UI says otherwise

### Meeting Now

Compute upcoming meetings from:

```text
day_of_week
start_time
timezone
```

No occurrence table is required initially.

## 12. Location

Two paths:

### Current location

Device/browser gives coordinates after explicit permission.

Those coordinates go directly to the meeting search API.

### Manual location

Address/city/ZIP is geocoded into temporary coordinates.

Do not automatically create a persistent user location history.

Meeting coordinates should come from the source when possible or from a durable geocoding approach suitable for stored data.

## 13. AI Search

AI is optional.

Flow:

```text
"NA after 6 near Mesa"
        ↓
AI
        ↓
{
  fellowship: ["NA"],
  location: "Mesa, AZ",
  timeAfter: "18:00"
}
        ↓
Zod validation
        ↓
normal search API/service
        ↓
stored meetings
```

AI does not:

- invent meeting names;
- invent addresses;
- choose meetings from its training data;
- bypass the database.

If AI is down:

> show ordinary search.

## 14. Incorrect Meeting Reports

For MVP:

```text
user report
→ meeting_reports table
→ protected internal report list
→ operator reviews it
```

Do not build a large case-management workflow for corrections yet.

A report never automatically removes a meeting.

## 15. Deployment

Keep deployment simple.

Minimum environments:

```text
local
production
```

Add staging when release workflow requires it.

### Client

- Expo web build
- EAS for iOS/Android

### API

Deploy one Node service.

### Database

Use managed PostgreSQL with PostGIS.

### Scheduled sync

Use the hosting provider's cron/scheduled-job feature to run the sync command.

Do not introduce Kubernetes, ECS orchestration, queues, or infrastructure-as-code unless operational needs justify them.

## 16. Security / Privacy

Required from day one:

- HTTPS
- secrets outside source control
- no API/database secrets in client bundle
- runtime validation
- parameterized database access
- protected internal/report endpoints
- basic rate limiting on AI/report endpoints

Do not log by default:

- exact current user coordinates;
- natural-language recovery searches;
- correction free text;
- online meeting passwords;
- future private recovery information.

## 17. Error Handling

Core principle:

```text
AI fails
→ normal search still works

map fails
→ list still works

one source sync fails
→ existing meeting database still works

one bad meeting record
→ skip/report that record
```

## 18. Testing Required for MVP

Must test:

- normalization adapters;
- repeated source sync/upsert;
- radius search;
- fellowship/time/format filters;
- location-denied fallback;
- meeting detail;
- Find a Meeting Now;
- AI text → filters;
- AI failure fallback;
- incorrect-meeting report submission.

Do not attempt exhaustive enterprise test coverage before the MVP exists.

## 19. Upgrade Triggers

Only add the heavier architecture if production gives a reason.

### Add queue/worker infrastructure when:

- sync jobs overlap;
- syncs take too long;
- sources need independent retry/concurrency.

### Add provenance/version history when:

- source disputes or historical debugging become common.

### Add advanced dedupe when:

- duplicate rate materially harms search quality.

### Add a dedicated admin app when:

- operating sources/reports through minimal internal tools becomes painful.

### Add sophisticated trust scoring when:

- users actually need more than source name + last sync + report warning.

### Add microservices when:

- one module needs materially independent scaling or deployment.

Until those triggers occur, keep the MVP boring.
